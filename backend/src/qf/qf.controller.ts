import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { QfService } from './qf.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Quadratic Funding')
@Controller('qf')
export class QfController {
  constructor(private readonly qfService: QfService) {}

  @ApiOperation({
    description:
      'Estimate the matched amount for a donation based on `donationAmount` & `grantId`',
  })
  @ApiOkResponse({
    description:
      "Returns 0 if grant doesn't exist or donationAmount less than or equal to 0.\
      <br />\
      Returns a positive number otherwise",
    type: Number,
  })
  @Get('estimate')
  async estimateMatchedAmount(
    @Query('donationAmount', new ParseIntPipe()) donationAmount: number,
    @Query('grantId') grantId: string,
  ) {
    return await this.qfService.estimateMatchedAmount(donationAmount, grantId);
  }
}
