import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Grant, Prisma, Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CheckoutGrantsDto,
  CreateGrantDto,
  ExtendedGrant,
  FeeAllocationMethod,
  GetGrantDto,
  GrantCheckout,
  GrantFilterOptions,
  GrantSortOptions,
  UpdateGrantDto,
} from './grants.interface';
import { ProviderService } from 'src/provider/provider.service';
import { AwsService } from 'src/aws/aws.service';
import * as cuid from 'cuid';

@Injectable()
export class GrantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly providerService: ProviderService,
    private readonly awsService: AwsService,
  ) {}

  private paymentProvider = this.providerService.getProvider();

  /**
   * Throws error if not a member, otherwise returns true
   * @param grant
   * @param user
   * @returns `true` if is a team member
   */
  checkGrantOwnership(grant: ExtendedGrant, user: User) {
    if (!grant.team.some((member) => member.id === user.id))
      throw new HttpException('No edit rights', HttpStatus.FORBIDDEN);
    return true;
  }

  /**
   * Converts a basic sorting string to something Prisma can understand
   * @param sort Sorting option
   * @returns Prisma orderBy query object
   */
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
      // case GrantSortOptions.MOST_FUNDED: // Currently quite difficult with prisma
      //   return {
      //     createdAt: 'desc',
      //   };
      case GrantSortOptions.MOST_BACKED:
        return {
          contributions: {
            _count: 'desc',
          },
        };
    }
  }

  /**
   * To retrieve all grants from public route
   * @param data
   * @returns
   */
  async getAllGrants(data: GetGrantDto): Promise<Grant[]> {
    const { isVerified, sort, filter, search } = data;

    let grants = await this.prisma.grant.findMany({
      where: {
        verified: isVerified,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      include: {
        contributions: true,
        team: true,
      },
      orderBy: this.parseSorting(sort),
    });

    // Apply filtering first. Currently no Prisma based solution, so it's a workaround
    switch (filter) {
      case GrantFilterOptions.FUNDED:
        grants = grants.filter((grant) => {
          const total = grant.contributions.reduce(
            (acc, contribution) => acc + contribution.amountUsd,
            0,
          );
          return total >= grant.fundingGoal;
        });
        break;
      case GrantFilterOptions.UNDERFUNDED:
        grants = grants.filter((grant) => {
          const total = grant.contributions.reduce(
            (acc, contribution) => acc + contribution.amountUsd,
            0,
          );
          return total < grant.fundingGoal;
        });
        break;
    }

    // Due to Prisma limitations, this is a workaround
    if (sort === GrantSortOptions.MOST_FUNDED) {
      grants = grants.sort((a, b) => {
        const aTotal = a.contributions.reduce(
          (acc, contribution) => acc + contribution.amountUsd,
          0,
        );
        const bTotal = b.contributions.reduce(
          (acc, contribution) => acc + contribution.amountUsd,
          0,
        );

        // Sort in descending order
        return bTotal - aTotal;
      });
    }
    return grants.map((grant) => {
      return {
        ...grant,
        amountRaised: grant.contributions.reduce(
          (acc, contribution) => acc + contribution.amountUsd,
          0,
        ),
      };
    });
  }

  /**
   * For internal use.
   * @note Also retrieves unverified grants
   * @param id ID of the grant to retrieve
   * @returns
   */
  async getGrantById(id: string): Promise<ExtendedGrant> {
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

  /**
   * Retrieve a grant by ID
   * @param id
   * @param user Used to check if the caller is the owner in the event
   * that the grant is still unverified to prevent leaking private info
   * @returns
   */
  async getGrant(id: string, user: User) {
    const grant = await this.getGrantById(id);

    if (!grant)
      throw new HttpException('Grant not found', HttpStatus.NOT_FOUND);

    /**
     * If a grant is not verified, we need to do a few checks:
     * 1. Only admins can view unverified grants
     * 2. Only the grant owner can view their own unverified grant
     */
    // if (!grant.verified) {
    //   if (!user)
    //     throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    //   if (user.role !== Role.Admin) this.checkGrantOwnership(grant, user);
    // }

    // Otherwise, we can return it
    return {
      ...grant,
      amountRaised: grant.contributions.reduce(
        (acc, contribution) => acc + contribution.amountUsd,
        0,
      ),
    };
  }

  /**
   * Creates a grant with the provided data
   * @param data
   * @param user The owner to tie this grant to
   * @returns
   */
  async createGrant(data: CreateGrantDto, user: User) {
    const paymentProvider = await this.paymentProvider;

    const id = cuid();

    // First, we need to upload this to AWS
    const image = await this.awsService.uploadFile(data.image, id);

    // After getting back the url, we create an entry in our database
    return await this.prisma.grant.create({
      data: {
        ...data,
        id,
        image,
        twitter: data.twitter || '',
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
      include: {
        team: true,
      },
    });
  }

  /**
   * Updates a grant
   * @param id
   * @param data
   * @param user Checks if caller is a team member that can edit this grant
   * @returns
   */
  async updateGrant(id: string, data: UpdateGrantDto, user: User) {
    // Ensure only a team member can edit this grant
    const grant = await this.getGrantById(id);

    if (!grant)
      throw new HttpException('Grant not found', HttpStatus.NOT_FOUND);

    // Check if grant owner is calling this function
    this.checkGrantOwnership(grant, user);

    let image;

    if (data.image) {
      image = await this.awsService.uploadFile(data.image, id);
    }

    return await this.prisma.grant.update({
      data: {
        ...data,
        image,
      },
      where: {
        id,
      },
    });
  }

  /**
   * Resubmit a grant for verification
   * @note Even the funding goal & payment account can be changed
   * @param id
   * @param data
   * @param user
   * @returns
   */
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

    // Check if grant owner is calling this function
    this.checkGrantOwnership(grant, user);

    const paymentProvider = await this.paymentProvider;

    const image = await this.awsService.uploadFile(data.image, id);

    return await this.prisma.grant.update({
      data: {
        ...data,
        image,
        verified: false, // Explicitly ensure the grant is in an unverified state
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

  /**
   * Retrieve the grants that the user wants to checkout
   * @param grants The grants to checkout
   * @param user User making the purchase
   */
  async checkoutGrants(body: CheckoutGrantsDto, user: User) {
    const { grants, feeAllocation } = body;
    /**
     * What we should do is to actually create a payment intent for each grant.
     * In order to do that, we need to go through each grant and receive their payment info
     */
    const ids = grants.map((grant) => grant.id);
    const data = await this.prisma.grant.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        paymentAccount: true,
      },
    });

    // Creating a lookup table to reduce time complexity of the grants merging to O(n)
    const amountLookup = grants.reduce((acc, grant) => {
      acc[grant.id] = grant.amount;
      return acc;
    }, {});

    // Here it is only O(n) rather than O(n^2) if we have a nested loop
    const grantWithFunding = data.map((grant) => {
      return {
        ...grant,
        amount: amountLookup[grant.id] || 0,
      };
    });

    // Pass to the payment provider to create a payment session
    return await this.providerService.createPaymentSession(
      grantWithFunding,
      feeAllocation || FeeAllocationMethod.PASS_TO_GRANT, // By default, we will pass the fees to grants
      user,
    );
  }
}
