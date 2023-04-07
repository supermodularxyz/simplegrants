import {
  Body,
  Controller,
  Get,
  Header,
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
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  CheckoutGrantsDto,
  CheckoutGrantsResponse,
  CreateGrantDto,
  GetGrantQueryDto,
  GrantDetailResponse,
  GrantResponse,
  ResubmitGrantDto,
  UpdateGrantDto,
} from './grants.interface';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { NextAuthGuard } from 'src/auth/guards/nextauth.guard';
import { Public } from 'src/auth/decorator/public.decorator';
import { FormDataRequest } from 'nestjs-form-data';
import { FormDataPipe } from 'src/pipes/form-data.pipe';

@ApiTags('Grants')
@Controller('grants')
export class GrantsController {
  constructor(private readonly grantsService: GrantsService) {}

  @ApiOperation({
    description: 'Get all verified grants in the system',
  })
  @ApiOkResponse({
    description: 'Retrieved all verified grants',
    type: [GrantResponse],
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
      ...queries,
    });
  }

  @ApiOperation({
    description: 'Create a grant',
  })
  @ApiCreatedResponse({
    description: 'Created a grant with the submitted data',
    type: GrantResponse,
  })
  @Post()
  @UseGuards(NextAuthGuard)
  @FormDataRequest()
  async createGrant(@Body(FormDataPipe) body: CreateGrantDto, @Request() req) {
    return await this.grantsService.createGrant(body, req.user);
  }

  @ApiOperation({
    description: 'Verify a grant',
  })
  @ApiCreatedResponse({
    description: 'Grant verified state is set to `true`',
    type: GrantResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not an admin',
  })
  @Post('verify/:id')
  @Roles(Role.Admin)
  @UseGuards(NextAuthGuard)
  async reviewGrant(@Param('id') id: string, @Request() req) {
    return await this.grantsService.reviewGrant(id, req.user);
  }

  @ApiOperation({
    description: 'Get a specific grant by ID',
  })
  @ApiOkResponse({
    description: 'Full details about the grant including team & contributions',
    type: GrantDetailResponse,
  })
  // @ApiUnauthorizedResponse({
  //   description: 'User has to be logged in to view an unverified grant',
  // })
  @ApiForbiddenResponse({
    description: 'User is not an admin or team member',
  })
  @ApiNotFoundResponse({
    description: 'Grant with given ID cannot be found',
  })
  @Get(':id')
  @Public()
  @UseGuards(NextAuthGuard)
  async getGrant(@Param('id') id: string, @Request() req) {
    return await this.grantsService.getGrant(id, req.user);
  }

  /**
   * This route is only used when editing a verified grant
   * @param body
   * @returns
   */
  @ApiOperation({
    description:
      "Update a grant by ID. Only works if you're a team member of the grant",
  })
  @ApiCreatedResponse({
    description: 'Updated grant information',
    type: GrantResponse,
  })
  @ApiForbiddenResponse({
    description: 'User is a team member of this grant',
  })
  @ApiNotFoundResponse({
    description: 'Grant with given ID cannot be found',
  })
  @Patch(':id')
  @FormDataRequest()
  @UseGuards(NextAuthGuard)
  async updateGrant(
    @Param('id') id: string,
    @Body(FormDataPipe) body: UpdateGrantDto,
    @Request() req,
  ) {
    return await this.grantsService.updateGrant(id, body, req.user);
  }

  /**
   * This route is only used when resubmitting an unverified grant
   * @param body
   * @returns
   */
  @ApiOperation({
    description:
      "Resubmit a grant by ID. Only works if you're a team member of the grant & the grant is unverified",
  })
  @ApiCreatedResponse({
    description: 'Updated grant information',
    type: GrantResponse,
  })
  @ApiForbiddenResponse({
    description: 'User is a team member of this grant',
  })
  @ApiUnprocessableEntityResponse({
    description:
      'Grant with given ID cannot be found or grant is already verified',
  })
  @Put(':id')
  @FormDataRequest()
  @UseGuards(NextAuthGuard)
  async resubmitGrant(
    @Param('id') id: string,
    @Body(FormDataPipe) body: ResubmitGrantDto,
    @Request() req,
  ) {
    return await this.grantsService.resubmitGrant(id, body, req.user);
  }

  @ApiOperation({
    description: 'Checkout selected grants',
  })
  @ApiCreatedResponse({
    description: 'Checkout link/information from the payment provider',
    type: CheckoutGrantsResponse,
  })
  @Post('checkout')
  @UseGuards(NextAuthGuard)
  async checkoutGrants(
    @Body(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    body: CheckoutGrantsDto,
    @Request() req,
  ) {
    return await this.grantsService.checkoutGrants(body, req.user);
  }
}
