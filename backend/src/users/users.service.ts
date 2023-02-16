import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto, UserProfile } from './users.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  private logger: LoggerService = new Logger(UsersService.name);

  async retrieveUserProfile(id: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        contributions: true,
        grants: {
          include: {
            contributions: true,
          },
        },
      },
    });

    return {
      ...user,
      grants: user.grants.map((grant) => {
        return {
          ...grant,
          amountRaised: grant.contributions.reduce(
            (acc, contribution) => acc + contribution.amountUsd,
            0,
          ),
        };
      }),
    };
  }

  async updateUserProfile(
    userId: string,
    data: UpdateUserDto,
  ): Promise<UserProfile> {
    const user = await this.prisma.user.update({
      data: {
        ...data,
      },
      where: {
        id: userId,
      },
      include: {
        contributions: true,
        grants: {
          include: {
            contributions: true,
          },
        },
      },
    });

    return {
      ...user,
      grants: user.grants.map((grant) => {
        return {
          ...grant,
          amountRaised: grant.contributions.reduce(
            (acc, contribution) => acc + contribution.amountUsd,
            0,
          ),
        };
      }),
    };
  }
}
