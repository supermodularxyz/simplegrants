import { Module } from '@nestjs/common';
import { GrantsService } from './grants.service';
import { GrantsController } from './grants.controller';

@Module({
  providers: [GrantsService],
  controllers: [GrantsController]
})
export class GrantsModule {}
