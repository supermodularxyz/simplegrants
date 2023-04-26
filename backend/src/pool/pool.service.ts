import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  EcosystemBuilder,
  MatchingRound,
  Prisma,
  Role,
  User,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProviderService } from 'src/provider/provider.service';
import {
  CheckoutPoolsDto,
  CheckoutPoolsResponse,
  CreatePoolDto,
  GetPoolDto,
  PoolFilterOptions,
  PoolResponse,
  PoolSortOptions,
  UpdatePoolDto,
} from './pool.interface';
import {
  CheckoutType,
  FeeAllocationMethod,
} from 'src/provider/provider.interface';
import { Image, createCanvas, loadImage } from 'canvas';
import { AwsService } from 'src/aws/aws.service';
import * as cuid from 'cuid';

@Injectable()
export class PoolService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly providerService: ProviderService,
    private readonly awsService: AwsService,
  ) {}

  /**
   * Throws error if not a member, otherwise returns true
   * @param pool
   * @param user
   * @returns `true` if is a team member
   */
  checkPoolOwnership(
    pool: MatchingRound & {
      funders: (EcosystemBuilder & { user: User })[];
    },
    user: User,
  ) {
    if (!pool.funders.some((member) => member.user.id === user.id))
      throw new HttpException('No edit rights', HttpStatus.FORBIDDEN);
    return true;
  }

  /**
   * Converts a basic sorting string to something Prisma can understand
   * @param sort Sorting option
   * @returns Prisma orderBy query object
   */
  parseSorting(sort: string): Prisma.MatchingRoundOrderByWithRelationInput {
    switch (sort) {
      case PoolSortOptions.NEWEST:
        return {
          createdAt: 'desc',
        };
      case PoolSortOptions.OLDEST:
        return {
          createdAt: 'asc',
        };
      // case PoolSortOptions.MOST_FUNDED: // Currently quite difficult with prisma
      //   return {
      //     createdAt: 'desc',
      //   };
      case PoolSortOptions.MOST_BACKED:
        return {
          contributions: {
            _count: 'desc',
          },
        };
    }
  }

  /**
   * Converts a basic filtering string to something Prisma can understand
   * @param filter Filtering option
   * @returns Prisma orderBy query object
   */
  parseFiltering(filter: string): Prisma.MatchingRoundWhereInput {
    switch (filter) {
      case PoolFilterOptions.ENDED:
        return {
          endDate: {
            lte: new Date(),
          },
        };
      case PoolFilterOptions.NOT_ENDED:
        return {
          endDate: {
            gt: new Date(),
          },
        };
    }
  }

  /**
   * To retrieve all pools from public route
   * @param data
   * @returns
   */
  async getAllPools(data: GetPoolDto) {
    const { isVerified, sort, filter, search } = data;

    let pools = await this.prisma.matchingRound.findMany({
      where: {
        verified: isVerified,
        name: {
          contains: search,
          mode: 'insensitive',
        },
        ...this.parseFiltering(filter),
      },
      include: {
        contributions: true,
      },
      orderBy: this.parseSorting(sort),
    });

    // Due to Prisma limitations, this is a workaround
    if (sort === PoolSortOptions.MOST_FUNDED) {
      pools = pools.sort((a, b) => {
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
    return pools.map((pool) => {
      return {
        ...pool,
        amountRaised: pool.contributions.reduce(
          (acc, contribution) => acc + contribution.amountUsd,
          0,
        ),
      };
    });
  }

  /**
   * For internal use.
   * @note Also retrieves unverified pools
   * @param id ID of the pool to retrieve
   * @returns
   */
  async getPoolById(id: string) {
    return await this.prisma.matchingRound.findUnique({
      where: {
        id,
      },
      include: {
        contributions: true,
        funders: {
          include: {
            user: true,
          },
        },
        grants: {
          include: {
            contributions: true,
            team: true,
          },
        },
      },
    });
  }

  /**
   * Retrieve a pool by ID
   * @param id
   * @param user Used to check if the caller is the owner in the event
   * that the pool is still unverified to prevent leaking private info
   * @returns
   */
  async getPool(id: string, user: User) {
    const pool = await this.getPoolById(id);

    if (!pool) throw new HttpException('Pool not found', HttpStatus.NOT_FOUND);

    /**
     * If a pool is not verified, we need to do a few checks:
     * 1. Only admins can view unverified pools
     * 2. Only the pool owner can view their own unverified pool
     */
    user; // Do nothing with user for now
    // if (!pool.verified) {
    //   if (!user)
    //     throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    //   if (user.role !== Role.Admin) this.checkPoolOwnership(pool, user);
    // }

    // Now we need to calculate the number of unique contributors
    const uniqueUserIds = new Set<string>();

    for (const contribution of pool.contributions) {
      uniqueUserIds.add(contribution.userId);
    }

    return {
      ...pool,
      grants: pool.grants.map((pool) => {
        return {
          ...pool,
          amountRaised: pool.contributions.reduce(
            (acc, contribution) => acc + contribution.amountUsd,
            0,
          ),
        };
      }),
      team: pool.funders.map((funder) => funder.user),
      contributors: uniqueUserIds.size,
      amountRaised: pool.contributions.reduce(
        (acc, contribution) => acc + contribution.amountUsd,
        0,
      ),
    };
  }

  /**
   * Draws an image with the appropriate dimensions like `object-fit: cover` in CSS
   * @param ctx
   * @param img
   * @param x
   * @param y
   * @param width
   * @param height
   */
  drawImg(
    ctx: any,
    img: Image,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    const aspectRatio = img.width / img.height;
    const targetAspectRatio = width / height;
    let targetWidth = width;
    let targetHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    // calculate scaling factor based on larger dimension of image and target area
    const scale =
      aspectRatio > targetAspectRatio ? height / img.height : width / img.width;

    // calculate target width and height based on scaling factor
    targetWidth = width / scale;
    targetHeight = height / scale;

    // calculate offsets to center image in target area
    offsetX = Math.max(0, (img.width - targetWidth) / 2);
    offsetY = Math.max(0, (img.height - targetHeight) / 2);

    // draw image with modified dimensions and centered in target area
    ctx.drawImage(
      img,
      offsetX,
      offsetY,
      targetWidth,
      targetHeight,
      x,
      y,
      width,
      height,
    );
  }

  /**
   * Generates a collage based on the grant images
   *
   * @param grantImages Array of image URLs
   * @returns
   */
  async generateCollage(grantImages: string[]) {
    const canvas = createCanvas(350, 210);
    const ctx = canvas.getContext('2d');
    const images: Image[] = [];

    for await (const image of grantImages) {
      images.push(await loadImage(image));
    }

    switch (grantImages.length) {
      case 1:
        this.drawImg(ctx, images[0], 0, 0, canvas.width, canvas.height);
        break;
      case 2:
        this.drawImg(ctx, images[0], 0, 0, canvas.width / 2, canvas.height);
        this.drawImg(
          ctx,
          images[1],
          canvas.width / 2,
          0,
          canvas.width / 2,
          canvas.height,
        );
        break;
      case 3:
        this.drawImg(ctx, images[0], 0, 0, canvas.width / 2, canvas.height);
        this.drawImg(
          ctx,
          images[1],
          canvas.width / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
        );
        this.drawImg(
          ctx,
          images[2],
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2,
          canvas.height / 2,
        );
        break;
      case 4:
        this.drawImg(ctx, images[0], 0, 0, canvas.width / 2, canvas.height / 2);
        this.drawImg(
          ctx,
          images[1],
          canvas.width / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
        );
        this.drawImg(
          ctx,
          images[2],
          0,
          canvas.height / 2,
          canvas.width / 2,
          canvas.height / 2,
        );
        this.drawImg(
          ctx,
          images[3],
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2,
          canvas.height / 2,
        );
        break;
      default:
        throw new Error('Unsupported number of grants.');
    }

    return canvas.toBuffer();
  }

  /**
   * Creates a pool with the provided data
   * @param data
   * @param user The owner to tie this pool to
   * @returns
   */
  async createPool(data: CreatePoolDto, user: User): Promise<PoolResponse> {
    const ecosystemBuilder = await this.prisma.ecosystemBuilder.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!ecosystemBuilder) {
      throw new HttpException(
        'User is not an ecosystem builder',
        HttpStatus.UNAUTHORIZED,
      );
    }

    /**
     * At this point, we can automatically generate the image of the pool based on the grants
     * This is done using node-canvas
     *
     * 1. Get the grants with the specified ID
     * 2. Get only the image URLs
     * 3. Pass it to the collage function
     * 4. Upload the image buffer to AWS
     * 5. Save the image URL into the database
     */

    const id = cuid();

    const grants = await this.prisma.grant.findMany({
      where: {
        id: {
          in: data.grants,
        },
      },
    });

    const grantImages = grants.map((grant) => grant.image).slice(0, 4);
    let image = undefined;
    if (grantImages.length > 0) {
      const imageBuffer = await this.generateCollage(grantImages);
      image = await this.awsService.uploadBuffer(imageBuffer, id);
    }

    const pool = await this.prisma.matchingRound.create({
      data: {
        ...data,
        id,
        image,
        funders: {
          connect: [
            {
              id: ecosystemBuilder.id,
            },
          ],
        },
        grants: {
          connect: data.grants.map((grantId) => {
            return {
              id: grantId,
            };
          }),
        },
      },
    });

    return {
      ...pool,
      amountRaised: 0,
      contributions: [],
    };
  }

  /**
   * Only an admin can execute this function
   * The Admin role check should already be done by the guard,
   * but adding another check here in case the guard was bypassed
   * @param id
   * @param user
   * @returns
   */
  async reviewPool(id: string, user: User) {
    // First we validate if the user is an admin
    if (user.role !== Role.Admin)
      throw new HttpException('Unauthorized Access', HttpStatus.UNAUTHORIZED);

    return await this.prisma.matchingRound.update({
      data: {
        verified: true,
      },
      where: {
        id,
      },
    });
  }

  /**
   * Updates a pool
   * @param id
   * @param data
   * @param user Checks if caller is a team member that can edit this pool
   * @returns
   */
  async updatePool(id: string, data: UpdatePoolDto, user: User) {
    // Ensure only a team member can edit this pool
    const pool = await this.getPoolById(id);

    if (!pool) throw new HttpException('Pool not found', HttpStatus.NOT_FOUND);

    // Check if pool owner is calling this function
    this.checkPoolOwnership(pool, user);

    /**
     * Here is the funny part:
     * 1. We need to disconnect all of the old grants under this pool that we removed
     * 2. We need to connect the grants that we received from the data
     */
    const toRemove = pool.grants.filter(
      (grant) => !data.grants.includes(grant.id),
    );

    return await this.prisma.matchingRound.update({
      data: {
        ...data,
        grants: {
          connect: data.grants.map((grantId) => {
            return {
              id: grantId,
            };
          }),
          disconnect: toRemove.map((grant) => {
            return {
              id: grant.id,
            };
          }),
        },
      },
      where: {
        id,
      },
    });
  }

  /**
   * Retrieve the pools that the user wants to checkout
   * @param pools The pools to checkout
   * @param user User making the purchase
   */
  async checkoutPools(
    body: CheckoutPoolsDto,
    user: User,
  ): Promise<CheckoutPoolsResponse> {
    const { pools, feeAllocation } = body;
    /**
     * What we should do is to actually create a payment intent for each pool.
     * In order to do that, we need to go through each pool and receive their payment info
     */
    const ids = pools.map((pool) => pool.id);
    const data = await this.prisma.matchingRound.findMany({
      where: {
        id: {
          in: ids,
        },
        endDate: {
          gt: new Date(),
        },
      },
    });

    /**
     * We also need to check if the pools have not ended.
     * What we can do is that we filter the ended pools & don't throw an error (for now)
     * Then, check if there are even any pools to checkout.
     * If no pools to checkout, throw error
     */
    if (data.length < 0)
      throw new HttpException('Pools not found', HttpStatus.NOT_FOUND);

    // Creating a lookup table to reduce time complexity of the pools merging to O(n)
    const amountLookup = pools.reduce((acc, pool) => {
      acc[pool.id] = pool.amount;
      return acc;
    }, {});

    // Here it is only O(n) rather than O(n^2) if we have a nested loop
    const poolWithFunding = data.map((pool) => {
      return {
        ...pool,
        amount: amountLookup[pool.id] || 0,
      };
    });

    // Pass to the payment provider to create a payment session
    return await this.providerService.createPaymentSession(
      poolWithFunding,
      feeAllocation || FeeAllocationMethod.PASS_TO_ENTITY, // By default, we will pass the fees to pools
      user,
      CheckoutType.POOL,
    );
  }
}
