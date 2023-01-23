import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Grant, Prisma, Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateGrantDto,
  GetGrantDto,
  GrantSortOptions,
  UpdateGrantDto,
} from './grants.interface';
import { ProviderService } from 'src/provider/provider.service';

@Injectable()
export class GrantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly providerService: ProviderService,
  ) {}

  private paymentProvider = this.providerService.getProvider();

  parseSorting(sort: string): Prisma.GrantOrderByWithRelationInput {
    switch (sort) {
      case GrantSortOptions.NEWEST:
        return {
          createdAt: 'desc',
        };
      case GrantSortOptions.OLDEST:
        return {
          createdAt: 'asc',
        };
      case GrantSortOptions.MOST_FUNDED: //TODO
        return {
          createdAt: 'desc',
        };
      case GrantSortOptions.MOST_BACKED:
        return {
          contributions: {
            _count: 'desc',
          },
        };
    }
  }

  async getAllGrants(data: GetGrantDto): Promise<Grant[]> {
    const { isVerified, sort, filter } = data;

    return await this.prisma.grant.findMany({
      where: {
        verified: isVerified,
      },
      orderBy: this.parseSorting(sort),
    });
  }

  async getGrantById(id: string) {
    return await this.prisma.grant.findUnique({
      where: {
        id,
      },
      include: {
        contributions: true,
        team: true,
      },
    });
  }

  async getGrant(id: string, user: User) {
    const grant = await this.getGrantById(id);

    /**
     * If a grant is not verified, we need to do a few checks:
     * 1. Only admins can view unverified grants
     * 2. Only the grant owner can view their own unverified grant
     */
    if (!grant.verified) {
      if (
        user.role !== Role.Admin ||
        !grant.team.some((member) => member.id === user.id)
      )
        throw new HttpException('Grant not found', HttpStatus.NOT_FOUND);
    }

    // Otherwise, we can return it
    return grant;
  }

  /**
   * Creates a grant with the provided data
   * @param data
   * @param user The owner to tie this grant to
   * @returns
   */
  async createGrant(data: CreateGrantDto, user: User) {
    const paymentProvider = await this.paymentProvider;

    return await this.prisma.grant.create({
      data: {
        ...data,
        verified: false,
        team: {
          connect: {
            id: user.id,
          },
        },
        paymentAccount: {
          connectOrCreate: {
            create: {
              recipientAddress: data.paymentAccount,
              provider: {
                connect: {
                  id: paymentProvider.id,
                },
              },
            },
            where: {
              recipientAddress_providerId: {
                recipientAddress: data.paymentAccount,
                providerId: paymentProvider.id,
              },
            },
          },
        },
      },
    });
  }

  async updateGrant(id: string, data: UpdateGrantDto, user: User) {
    // Ensure only a team member can edit this grant
    const grant = await this.getGrantById(id);

    if (!grant)
      throw new HttpException('Grant not found', HttpStatus.NOT_FOUND);
    if (!grant.team.some((member) => member.id === user.id))
      throw new HttpException('No edit rights', HttpStatus.FORBIDDEN);

    return await this.prisma.grant.update({
      data: {
        ...data,
      },
      where: {
        id,
      },
    });
  }

  async resubmitGrant(id: string, data: CreateGrantDto, user: User) {
    const grant = await this.getGrantById(id);

    /**
     * If a grant doesn't exist or is already verified,
     * we cannot allow it to update funding goal & payment provider
     */
    if (!grant || grant.verified)
      throw new HttpException(
        'Grant cannot be resubmitted',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    if (!grant.team.some((member) => member.id === user.id))
      throw new HttpException('No edit rights', HttpStatus.FORBIDDEN);

    const paymentProvider = await this.paymentProvider;

    return await this.prisma.grant.update({
      data: {
        ...data,
        paymentAccount: {
          connectOrCreate: {
            create: {
              recipientAddress: data.paymentAccount,
              provider: {
                connect: {
                  id: paymentProvider.id,
                },
              },
            },
            where: {
              recipientAddress_providerId: {
                recipientAddress: data.paymentAccount,
                providerId: paymentProvider.id,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });
  }

  /**
   * Only an admin can execute this function
   * The Admin role check should already be done by the guard,
   * but adding another check here in case the guard was bypassed
   * @param id
   * @param user
   * @returns
   */
  async reviewGrant(id: string, user: User) {
    // First we validate if the user is an admin
    if (user.role !== Role.Admin)
      throw new HttpException('Unauthorized Access', HttpStatus.UNAUTHORIZED);

    return await this.prisma.grant.update({
      data: {
        verified: true,
      },
      where: {
        id,
      },
    });
  }
}
