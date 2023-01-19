import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
  Body,
  CacheInterceptor,
} from '@nestjs/common';
import { NextAuthGuard } from 'src/auth/guards/nextauth.guard';
import { UsersService } from './users.service';
import { RequestWithUser, UpdateUserDto, UserProfile } from './users.interface';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
@UseInterceptors(CacheInterceptor, ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    description: 'Retrieves the user profile based on the user session cookies',
  })
  @ApiOkResponse({
    description: 'The user profile',
    type: UserProfile,
  })
  @UseGuards(NextAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser) {
    return new UserProfile(
      await this.usersService.retrieveUserProfile(req.user.id),
    );
  }

  @ApiOperation({
    description: 'Updates the user profile',
  })
  @ApiOkResponse({
    description: 'Updated user profile',
    type: UserProfile,
  })
  @UseGuards(NextAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() body: UpdateUserDto,
  ) {
    // Since we already have the user ID, we do not need any params
    return new UserProfile(
      await this.usersService.updateUserProfile(req.user.id, body),
    );
  }
}
