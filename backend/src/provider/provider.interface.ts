import { ApiResponseProperty } from '@nestjs/swagger';

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

export class ProviderResponse {
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
  type: string;

  @ApiResponseProperty({
    type: [String],
  })
  acceptedCountries: string[];

  @ApiResponseProperty({
    type: [String],
  })
  denominations: string[];

  @ApiResponseProperty({
    type: String,
  })
  website: string;

  @ApiResponseProperty({})
  schema: any;

  @ApiResponseProperty({
    type: Number,
  })
  version: number;

  @ApiResponseProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiResponseProperty({
    type: Date,
  })
  updatedAt: Date;
}
