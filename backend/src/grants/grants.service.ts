import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Grant, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateGrantDto,
  GetGrantDto,
  GrantSortOptions,
  ResubmitGrantDto,
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

  async getGrantById(id: string): Promise<Grant> {
    return await this.prisma.grant.findUnique({
      where: {
        id,
      },
    });
  }

  async createGrant(data: CreateGrantDto) {
    const paymentProvider = await this.paymentProvider;

    return await this.prisma.grant.create({
      data: {
        ...data,
        verified: false,
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

  async updateGrant(data: UpdateGrantDto) {
    return await this.prisma.grant.update({
      data: {
        ...data,
      },
      where: {
        id: data.id,
      },
    });
  }

  async resubmitGrant(data: ResubmitGrantDto) {
    const grant = await this.getGrantById(data.id);

    /**
     * If a grant doesn't exist or is already verified,
     * we cannot allow it to update funding goal & payment provider
     */
    if (!grant || grant.verified)
      throw new HttpException(
        'Grant cannot be resubmitted',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

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
        id: data.id,
      },
    });
  }
}
