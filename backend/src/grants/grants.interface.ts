import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger';
import { Grant, PaymentAccount } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Contribution } from 'src/contributions/contributions.interface';
import { User, UserProfile } from 'src/users/users.interface';

export enum GrantSortOptions {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  MOST_FUNDED = 'most_funded',
  MOST_BACKED = 'most_backed',
}

export enum GrantFilterOptions {
  FUNDED = 'funded',
  UNDERFUNDED = 'underfunded',
}

export enum FeeAllocationMethod {
  PASS_TO_CUSTOMER = 'customer',
  PASS_TO_GRANT = 'grant',
}

export class GetGrantQueryDto {
  @ApiPropertyOptional({
    enum: GrantSortOptions,
  })
  @IsEnum(GrantSortOptions)
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({
    enum: GrantFilterOptions,
  })
  @IsEnum(GrantFilterOptions)
  @IsOptional()
  filter?: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @IsOptional()
  search?: string;
}

export class GetGrantDto extends GetGrantQueryDto {
  isVerified?: boolean;
}

export class UpdateGrantDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  location: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  twitter: string;

  @ApiProperty({
    type: String,
  })
  @IsUrl()
  website: string;

  @ApiProperty({
    type: String,
  })
  @IsUrl()
  image: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  description: string;
}

export class CreateGrantDto extends UpdateGrantDto {
  @ApiProperty({
    type: Number,
  })
  @IsPositive()
  fundingGoal: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  paymentAccount: string;
}

export class GrantResponse {
  @ApiResponseProperty({
    type: String,
  })
  id: string;

  @ApiResponseProperty({
    type: String,
  })
  name: string;

  @ApiResponseProperty({
    type: String,
  })
  description: string;

  @ApiResponseProperty({
    type: String,
  })
  image: string;

  @ApiResponseProperty({
    type: String,
  })
  twitter: string;

  @ApiResponseProperty({
    type: String,
  })
  website: string;

  @ApiResponseProperty({
    type: String,
  })
  location: string;

  @ApiResponseProperty({
    type: String,
  })
  paymentAccountId: string;

  @ApiResponseProperty({
    type: Number,
  })
  fundingGoal: number;

  @ApiResponseProperty({
    type: Number,
  })
  amountRaised: number;

  @ApiResponseProperty({
    type: Boolean,
  })
  verified: boolean;

  @ApiResponseProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiResponseProperty({
    type: Date,
  })
  updatedAt: Date;
}

export class GrantDetailResponse extends GrantResponse {
  @ApiResponseProperty({
    type: [UserProfile],
  })
  team: UserProfile[];

  @ApiResponseProperty({
    type: [Contribution],
  })
  contributions: Contribution[];
}

export type ExtendedGrant = Grant & {
  contributions: Contribution[];
  team: User[];
};

export class GrantCheckout {
  @ApiProperty({
    type: String,
  })
  @IsString()
  id: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  amount: number;
}

export class CheckoutGrantsDto {
  @ApiProperty({
    type: [GrantCheckout],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => GrantCheckout)
  grants: GrantCheckout[];

  @ApiProperty({
    enum: FeeAllocationMethod,
  })
  @IsEnum(FeeAllocationMethod)
  @IsOptional()
  feeAllocation?: FeeAllocationMethod;
}

// TODO: Make it agnostic to whichever payment provider
export class CheckoutGrantsResponse {
  @ApiResponseProperty({
    type: String,
  })
  url: string;
}

export class GrantWithFunding {
  amount: number;
  id: string;
  name: string;
  description: string;
  image: string;
  twitter: string;
  website: string;
  location: string;
  paymentAccountId: string;
  fundingGoal: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  paymentAccount: PaymentAccount;
}
