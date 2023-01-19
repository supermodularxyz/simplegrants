import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export enum GrantSortOptions {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  MOST_FUNDED = 'most_funded',
  MOST_BACKED = 'most_backed',
}

export class GetGrantQueryDto {
  @ApiProperty({
    enum: GrantSortOptions,
  })
  @IsEnum(GrantSortOptions)
  @IsOptional()
  sort?: string;

  // @ApiProperty({
  //   enum: GrantFilterOptions,
  // })
  // @IsEnum(GrantFilterOptions)
  @IsString()
  @IsOptional()
  filter?: string;
}

export class GetGrantDto {
  isVerified?: boolean;
  sort?: string;
  filter?: string;
}

export class GetGrantResponse {
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
