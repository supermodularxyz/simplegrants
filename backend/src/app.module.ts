import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FingerprintModule } from './fingerprint/fingerprint.module';
import { GrantsModule } from './grants/grants.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    FingerprintModule,
    GrantsModule,
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
