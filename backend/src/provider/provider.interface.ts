import { ApiResponseProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

/**
 * Information about a specific checkout session
 *
 * @param donated The amount donated
 * @param matched The **estimated** amount matched. This may not be 100% accurate
 * @param numberOfGrants The number of grants this user donated to
 */
export class SuccessfulCheckoutInfo {
  @ApiResponseProperty({
    type: Number,
  })
  donated: number;

  @ApiResponseProperty({
    type: Number,
  })
  matched: number;

  @ApiResponseProperty({
    type: Number,
  })
  numberOfGrants: number;
}

/**
 * Information about a specific payment provider
 *
 * Majority of properties are excluded
 */
export class ProviderResponse {
  @Exclude()
  id: string;

  @ApiResponseProperty({
    type: String,
  })
  name: string;

  @ApiResponseProperty({
    type: String,
  })
  type: string;

  @ApiResponseProperty({
    type: [String],
  })
  acceptedCountries: string[];

  @ApiResponseProperty({
    type: [String],
  })
  denominations: string[];

  @Exclude()
  website: string;

  @Exclude()
  schema: any;

  @Exclude()
  version: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<ProviderResponse>) {
    Object.assign(this, partial);
  }
}
