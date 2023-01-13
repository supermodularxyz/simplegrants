import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { User } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  private logger: LoggerService = new Logger(UsersService.name);

  async findUserById(id: string): Promise<User | undefined> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
