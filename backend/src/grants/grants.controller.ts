import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { GrantsService } from './grants.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateGrantDto,
  GetGrantQueryDto,
  GetGrantResponse,
  UpdateGrantDto,
} from './grants.interface';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from '@prisma/client';
import { NextAuthGuard } from 'src/auth/guards/nextauth.guard';

@ApiTags('Grants')
@Controller('grants')
export class GrantsController {
  constructor(private readonly grantsService: GrantsService) {}

  @ApiOperation({
    description: 'Get all verified grants in the system',
  })
  @ApiOkResponse({
    description: 'Retrieved all verified grants',
    type: [GetGrantResponse],
  })
  @Get()
  async getAllGrants(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    queries?: GetGrantQueryDto,
  ) {
    return await this.grantsService.getAllGrants({
      isVerified: true,
      sort: queries.sort,
      filter: queries.filter,
    });
  }

  /**
   * TODO:
   * Search grants
   */

  @Post()
  @UseGuards(NextAuthGuard)
  async createGrant(@Body() body: CreateGrantDto, @Request() req) {
    return await this.grantsService.createGrant(body, req.user);
  }

  @Post('verify/:id')
  @Roles(Role.Admin)
  @UseGuards(NextAuthGuard)
  async reviewGrant(@Param('id') id: string, @Request() req) {
    return await this.grantsService.reviewGrant(id, req.user);
  }

  @Get(':id')
  async getGrant(@Param('id') id: string, @Request() req) {
    return await this.grantsService.getGrant(id, req.user);
  }

  /**
   * This route is only used when editing a verified grant
   * @param body
   * @returns
   */
  @Patch(':id')
  @UseGuards(NextAuthGuard)
  async updateGrant(
    @Param('id') id: string,
    @Body() body: UpdateGrantDto,
    @Request() req,
  ) {
    return await this.grantsService.updateGrant(id, body, req.user);
  }

  /**
   * This route is only used when resubmitting an unverified grant
   * @param body
   * @returns
   */
  @Put(':id')
  @UseGuards(NextAuthGuard)
  async resubmitGrant(
    @Param('id') id: string,
    @Body() body: CreateGrantDto,
    @Request() req,
  ) {
    return await this.grantsService.resubmitGrant(id, body, req.user);
  }
}
