import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { User } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto, UserProfile } from './users.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  private logger: LoggerService = new Logger(UsersService.name);

  async retrieveUserProfile(id: string): Promise<UserProfile> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        contributions: true,
        grants: true,
      },
    });
  }

  async updateUserProfile(
    userId: string,
    data: UpdateUserDto,
  ): Promise<UserProfile> {
    return await this.prisma.user.update({
      data: {
        ...data,
      },
      where: {
        id: userId,
      },
      include: {
        contributions: true,
        grants: true,
      },
    });
  }
}
