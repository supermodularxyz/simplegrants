import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { QfService } from './qf.service';

@Controller('qf')
export class QfController {
  constructor(private readonly qfService: QfService) {}

  @Get('estimate')
  async estimateMatchedAmount(
    @Query('donationAmount', new ParseIntPipe()) donationAmount: number,
    @Query('grantId') grantId: string,
  ) {
    return await this.qfService.estimateMatchedAmount(donationAmount, grantId);
  }
}
