import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProviderService],
  exports: [ProviderService],
})
export class ProviderModule {}
