import { Injectable } from '@nestjs/common';
import { Grant, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetGrantDto, GrantSortOptions } from './grants.interface';

@Injectable()
export class GrantsService {
  constructor(private readonly prisma: PrismaService) {}

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
}
