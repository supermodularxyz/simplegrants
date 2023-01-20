import { Module } from '@nestjs/common';
import { GrantsService } from './grants.service';
import { GrantsController } from './grants.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProviderModule } from 'src/provider/provider.module';

@Module({
  imports: [PrismaModule, ProviderModule],
  providers: [GrantsService],
  controllers: [GrantsController],
})
export class GrantsModule {}
