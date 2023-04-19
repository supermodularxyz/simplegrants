import { Module } from '@nestjs/common';
import { QfService } from './qf.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QfController } from './qf.controller';
import { ProviderModule } from 'src/provider/provider.module';

@Module({
  imports: [PrismaModule, ProviderModule],
  providers: [QfService],
  exports: [QfService],
  controllers: [QfController],
})
export class QfModule {}
