import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GrantsModule } from './grants/grants.module';
import { ProviderModule } from './provider/provider.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    GrantsModule,
    CacheModule.register({
      isGlobal: true,
    }),
    ProviderModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
