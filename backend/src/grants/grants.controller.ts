import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { GrantsService } from './grants.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateGrantDto,
  GetGrantQueryDto,
  GetGrantResponse,
  ResubmitGrantDto,
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
   * Add grant
   * Validate grant (only for admins)
   * Edit grants
   */
  @Post()
  async createGrant(@Body() body: CreateGrantDto) {
    return await this.grantsService.createGrant(body);
  }

  /**
   * This route is only used when editing a verified grant
   * @param body
   * @returns
   */
  @Patch()
  async updateGrant(@Body() body: UpdateGrantDto) {
    return await this.grantsService.updateGrant(body);
  }
}
