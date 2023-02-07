import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProviderController } from './provider.controller';

@Module({
  imports: [PrismaModule],
  providers: [ProviderService],
  exports: [ProviderService],
  controllers: [ProviderController],
})
export class ProviderModule {}
