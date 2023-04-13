import { Module } from '@nestjs/common';
import { PoolController } from './pool.controller';
import { PoolService } from './pool.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProviderModule } from 'src/provider/provider.module';

@Module({
  imports: [PrismaModule, ProviderModule],
  controllers: [PoolController],
  providers: [PoolService],
})
export class PoolModule {}
