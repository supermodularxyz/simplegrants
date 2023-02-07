import { Body, Controller, Post } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { PaymentIntentEventWebhookBody } from './adapter/stripe';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payment Provider')
@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post('webhook')
  async handlePaymentWebhook(@Body() body: PaymentIntentEventWebhookBody) {
    return await this.providerService.handlePaymentWebhook(body);
  }
}
