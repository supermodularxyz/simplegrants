import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GrantsModule } from './grants/grants.module';
import { ProviderModule } from './provider/provider.module';
import { AuthModule } from './auth/auth.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AwsModule } from './aws/aws.module';
import { QfModule } from './qf/qf.module';
import { InvitesModule } from './invites/invites.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PoolModule } from './pool/pool.module';

@Module({
  imports: [
    UsersModule,
    GrantsModule,
    CacheModule.register({
      isGlobal: true,
    }),
    NestjsFormDataModule.config({
      isGlobal: true,
    }),
    ProviderModule,
    AuthModule,
    AwsModule,
    QfModule,
    InvitesModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ScheduleModule.forRoot(),
    PoolModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
