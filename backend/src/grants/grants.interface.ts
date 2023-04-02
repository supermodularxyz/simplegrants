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
import { HasMimeType, IsFile } from 'nestjs-form-data';
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

class FileTypeResult {
  @ApiProperty({
    type: String,
  })
  ext: string;
  @ApiProperty({
    type: String,
  })
  mime: string;
}

class MemoryStoredFile {
  @ApiProperty({
    type: String,
  })
  originalName: string;

  @ApiProperty({
    type: String,
  })
  encoding: string;

  @ApiProperty({
    type: String,
  })
  busBoyMimeType: string;

  @ApiProperty({
    type: Buffer,
  })
  buffer: Buffer;

  @ApiProperty({
    type: Number,
  })
  size: number;

  @ApiProperty({
    type: FileTypeResult,
  })
  fileType: FileTypeResult;
}

export class UpdateGrantDto {
  @ApiProperty({
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  location: string;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  twitter?: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @IsUrl()
  @IsOptional()
  website: string;

  @ApiProperty({
    type: MemoryStoredFile,
    nullable: true,
  })
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/jpg', 'image/png'])
  @IsOptional()
  image: any;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description: string;
}

export class CreateGrantDto {
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

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @IsOptional()
  twitter?: string;

  @ApiProperty({
    type: String,
  })
  @IsUrl()
  website: string;

  @ApiProperty({
    type: MemoryStoredFile,
  })
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/jpg', 'image/png'])
  image: any;

  @ApiProperty({
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: Number,
  })
  @Type(() => Number)
  @IsPositive()
  fundingGoal: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  paymentAccount: string;
}

export class ResubmitGrantDto extends UpdateGrantDto {
  @ApiProperty({
    type: Number,
  })
  @Type(() => Number)
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
    type: [Contribution],
  })
  contributions?: Contribution[];

  @ApiResponseProperty({
    type: [User],
  })
  team?: User[];

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

  @ApiResponseProperty({
    type: String,
  })
  paymentAccount: string;
}

export type ExtendedGrant = Grant & {
  contributions: Contribution[];
  team: User[];
  paymentAccount: PaymentAccount;
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
