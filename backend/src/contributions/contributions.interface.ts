import { ApiResponseProperty } from '@nestjs/swagger';

export class Contribution {
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
  paymentMethodId: string;

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
