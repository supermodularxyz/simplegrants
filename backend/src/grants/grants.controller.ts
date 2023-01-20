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
   * Validate grant (only for admins)
   * Search grants
   */

  @Post()
  async createGrant(@Body() body: CreateGrantDto) {
    return await this.grantsService.createGrant(body);
  }

  @Get(':id')
  async getGrant(@Param('id') id: string, @Request() req) {
    return await this.grantsService.getGrant(id, req.user);
  }

  // TODO: Ensure grants can only be edited/resubmitted by owner/team member
  /**
   * This route is only used when editing a verified grant
   * @param body
   * @returns
   */
  @Patch(':id')
  async updateGrant(@Param('id') id: string, @Body() body: UpdateGrantDto) {
    return await this.grantsService.updateGrant(id, body);
  }

  /**
   * This route is only used when resubmitting an unverified grant
   * @param body
   * @returns
   */
  @Put(':id')
  async resubmitGrant(@Param('id') id: string, @Body() body: CreateGrantDto) {
    return await this.grantsService.updateGrant(id, body);
  }
}
