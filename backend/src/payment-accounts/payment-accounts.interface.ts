import { ApiResponseProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { ProviderResponse } from 'src/provider/provider.interface';

export class PaymentAccount {
  @ApiResponseProperty({
    type: String,
  })
  id: string;

  @ApiResponseProperty({
    type: String,
  })
  recipientAddress: string;

  @Exclude()
  providerId: string;

  @ApiResponseProperty({
    type: ProviderResponse,
  })
  @Type(() => ProviderResponse)
  provider: ProviderResponse;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<PaymentAccount>) {
    Object.assign(this, partial);
  }
}
