import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
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
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { NextAuthGuard } from 'src/auth/guards/nextauth.guard';
import { FormDataPipe } from 'src/pipes/form-data.pipe';
import { RequestWithUser } from 'src/users/users.interface';
import {
  GetPoolQueryDto,
  PoolDetailResponse,
  PoolResponse,
} from './pool.interface';
import { Public } from 'src/auth/decorator/public.decorator';

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

  //   @ApiOperation({
  //     description: 'Create a pool',
  //   })
  //   @ApiCreatedResponse({
  //     description: 'Created a pool with the submitted data',
  //     type: PoolResponseWithTeam,
  //   })
  //   @Post()
  //   @UseGuards(NextAuthGuard)
  //   @FormDataRequest()
  //   async createPool(
  //     @Body(FormDataPipe) body: CreatePoolDto,
  //     @Request() req: RequestWithUser,
  //   ) {
  //     return new PoolResponseWithTeam(
  //       await this.poolService.createPool(body, req.user),
  //     );
  //   }

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
}
