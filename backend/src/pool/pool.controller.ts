import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { PoolService } from './pool.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { NextAuthGuard } from 'src/auth/guards/nextauth.guard';
import { FormDataPipe } from 'src/pipes/form-data.pipe';
import { RequestWithUser } from 'src/users/users.interface';
import {
  BasicPoolResponse,
  CreatePoolDto,
  GetPoolQueryDto,
  PoolDetailResponse,
  PoolResponse,
  UpdatePoolDto,
} from './pool.interface';
import { Public } from 'src/auth/decorator/public.decorator';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';

@ApiTags('Matching Pools / Matching Rounds')
@Controller('pools')
@UseInterceptors(ClassSerializerInterceptor)
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @ApiOperation({
    description: 'Get all verified pools in the system',
  })
  @ApiOkResponse({
    description: 'Retrieved all verified pools',
    type: [PoolResponse],
  })
  @Get()
  async getAllPools(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    queries?: GetPoolQueryDto,
  ) {
    return (
      await this.poolService.getAllPools({
        isVerified: true,
        ...queries,
      })
    ).map((pool) => new PoolResponse(pool));
  }

  @ApiOperation({
    description: 'Create a pool',
  })
  @ApiCreatedResponse({
    description: 'Created a pool with the submitted data',
    type: PoolResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not an ecosystem builder',
  })
  @Post()
  @UseGuards(NextAuthGuard)
  async createPool(
    @Body() body: CreatePoolDto,
    @Request() req: RequestWithUser,
  ) {
    return new PoolResponse(await this.poolService.createPool(body, req.user));
  }

  @ApiOperation({
    description: 'Verify a pool',
  })
  @ApiCreatedResponse({
    description: 'Pool verified state is set to `true`',
    type: BasicPoolResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not an admin',
  })
  @Post('verify/:id')
  @Roles(Role.Admin)
  @UseGuards(NextAuthGuard)
  async reviewPool(@Param('id') id: string, @Request() req: RequestWithUser) {
    return new BasicPoolResponse(
      await this.poolService.reviewPool(id, req.user),
    );
  }

  @ApiOperation({
    description: 'Get a specific pool by ID',
  })
  @ApiOkResponse({
    description: 'Full details about the pool including team & contributions',
    type: PoolDetailResponse,
  })
  // @ApiUnauthorizedResponse({
  //   description: 'User has to be logged in to view an unverified pool',
  // })
  @ApiForbiddenResponse({
    description: 'User is not an admin or team member',
  })
  @ApiNotFoundResponse({
    description: 'Pool with given ID cannot be found',
  })
  @Get(':id')
  @Public()
  @UseGuards(NextAuthGuard)
  async getPool(@Param('id') id: string, @Request() req: RequestWithUser) {
    return new PoolDetailResponse(await this.poolService.getPool(id, req.user));
  }

  /**
   * This route is only used when editing a verified pool
   * @param body
   * @returns
   */
  @ApiOperation({
    description:
      "Update a pool by ID. Only works if you're a team member of the pool",
  })
  @ApiCreatedResponse({
    description: 'Updated pool information',
    type: BasicPoolResponse,
  })
  @ApiForbiddenResponse({
    description: 'User is a team member of this pool',
  })
  @ApiNotFoundResponse({
    description: 'Pool with given ID cannot be found',
  })
  @Patch(':id')
  @FormDataRequest()
  @UseGuards(NextAuthGuard)
  async updatePool(
    @Param('id') id: string,
    @Body(FormDataPipe) body: UpdatePoolDto,
    @Request() req: RequestWithUser,
  ) {
    return new BasicPoolResponse(
      await this.poolService.updatePool(id, body, req.user),
    );
  }
}
