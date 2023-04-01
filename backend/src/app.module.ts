import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GrantsModule } from './grants/grants.module';
import { ProviderModule } from './provider/provider.module';
import { AuthModule } from './auth/auth.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AwsModule } from './aws/aws.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
