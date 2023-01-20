import { Injectable } from '@nestjs/common';
import { Grant, Prisma } from '@prisma/client';
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

  async createGrant(data: CreateGrantDto) {
    const paymentProvider = await this.providerService.getProvider();

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
}
