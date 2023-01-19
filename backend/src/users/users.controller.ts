import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
  Body,
} from '@nestjs/common';
import { NextAuthGuard } from 'src/auth/guards/nextauth.guard';
import { UsersService } from './users.service';
import { RequestWithUser, UpdateUserDto, UserProfile } from './users.interface';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(NextAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser) {
    return new UserProfile(
      await this.usersService.retrieveUserProfile(req.user.id),
    );
  }

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
