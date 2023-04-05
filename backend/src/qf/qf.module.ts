import { Module } from '@nestjs/common';
import { QfService } from './qf.service';
import { QfController } from './qf.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [QfService],
  exports: [QfService],
  controllers: [QfController],
})
export class QfModule {}
