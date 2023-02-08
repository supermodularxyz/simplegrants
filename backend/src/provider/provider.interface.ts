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
