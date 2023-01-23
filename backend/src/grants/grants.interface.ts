import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Grant } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import { UserProfile } from 'src/users/users.interface';

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

class Contribution {
  @ApiResponseProperty({
    type: String,
  })
  id: string;

  @ApiResponseProperty({
    type: String,
  })
  userId: string;

  @ApiResponseProperty({
    type: Number,
  })
  amount: number;

  @ApiResponseProperty({
    type: String,
  })
  denomination: string;

  @ApiResponseProperty({
    type: Number,
  })
  amountUsd: number;

  @ApiResponseProperty({
    type: String,
  })
  paymentAccountId: string;

  @ApiResponseProperty({
    type: String,
  })
  grantId: string | null;

  @ApiResponseProperty({
    type: String,
  })
  matchingRoundId: string | null;

  @ApiResponseProperty({
    type: Boolean,
  })
  flagged: boolean;

  @ApiResponseProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiResponseProperty({
    type: Date,
  })
  updatedAt: Date;
}

export class GetGrantQueryDto {
  @ApiProperty({
    enum: GrantSortOptions,
  })
  @IsEnum(GrantSortOptions)
  @IsOptional()
  sort?: string;

  @ApiProperty({
    enum: GrantFilterOptions,
  })
  @IsEnum(GrantFilterOptions)
  @IsOptional()
  filter?: string;

  @ApiProperty({
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
  team: UserProfile[];
};
