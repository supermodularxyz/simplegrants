import { Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { NextAuthGuard } from 'src/auth/guards/nextauth.guard';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { InviteCodeResponse } from './invites.interface';

@UseGuards(ThrottlerGuard)
@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  // Most likely won't create an API for this for now
  //   @Post()
  //   async createInvites() {
  //     return await this.invitesService.createInvites()
  //   }

  /**
   * Claim an invite code
   * Rate limited to:
   * 3 tries for 24 hours
   */
  @ApiOperation({
    description: 'Claim an invite code to be an Ecosystem Builder',
  })
  @ApiOkResponse({
    description: 'Ecosystem Builder account created',
    type: InviteCodeResponse,
  })
  @Throttle(3, 86400)
  @Post(':code')
  @UseGuards(NextAuthGuard)
  async claimInviteCode(@Param('code') inviteCode: string, @Request() req) {
    return new InviteCodeResponse(
      await this.invitesService.claimInviteCode(inviteCode, req.user),
    );
  }
}
