import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AdminPrivilegeDto } from './auth.interface';
import { NextAuthGuard } from './guards/nextauth.guard';
import { AuthService } from './auth.service';
import { Roles } from './decorator/roles.decorator';
import { Role } from '@prisma/client';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequestWithUser, UserProfile } from 'src/users/users.interface';

@ApiTags('Admin')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    description: 'Give admin privileges to a user',
  })
  @ApiCreatedResponse({
    description: 'User with admin role',
    type: [UserProfile],
  })
  @ApiForbiddenResponse({
    description: 'User is not an admin',
  })
  @Post('admin/grant')
  @Roles(Role.Admin)
  @UseGuards(NextAuthGuard)
  async grantAdminPrivilege(
    @Body() body: AdminPrivilegeDto,
    @Request() req: RequestWithUser,
  ) {
    return this.authService.grantAdminPrivilege(body.email, req.user);
  }

  @ApiOperation({
    description:
      'Revoke admin privileges to a user.<br />⚠️ Be careful, you can revoke yourself!',
  })
  @ApiCreatedResponse({
    description: 'User with user role',
    type: [UserProfile],
  })
  @ApiForbiddenResponse({
    description: 'User is not an admin',
  })
  @Post('admin/revoke')
  @Roles(Role.Admin)
  @UseGuards(NextAuthGuard)
  async revokeAdminPrivilege(
    @Body() body: AdminPrivilegeDto,
    @Request() req: RequestWithUser,
  ) {
    return this.authService.revokeAdminPrivilege(body.email, req.user);
  }
}
