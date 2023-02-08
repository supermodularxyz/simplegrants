import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { PaymentIntentEventWebhookBody } from './adapter/stripe';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessfulCheckoutInfo } from './provider.interface';

@ApiTags('Payment Provider / Checkout')
@Controller('checkout')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @ApiOperation({
    description:
      "Trigger the payment provider's webhook.<br />Note: **This should NOT be called directly.**",
  })
  @Post('webhook')
  async handlePaymentWebhook(@Body() body: PaymentIntentEventWebhookBody) {
    return await this.providerService.handlePaymentWebhook(body);
  }

  @ApiOperation({
    description:
      'Retrieve information about a specific checkout session by session ID',
  })
  @ApiOkResponse({
    description: 'Information about the specific checkout session',
    type: SuccessfulCheckoutInfo,
  })
  @Get(':sessionId')
  async retrieveCheckoutInfo(@Param('sessionId') sessionId: string) {
    return await this.providerService.retrieveCheckoutInfo(sessionId);
  }
}
