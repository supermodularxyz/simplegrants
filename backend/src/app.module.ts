import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GrantsModule } from './grants/grants.module';
import { ProviderModule } from './provider/provider.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    GrantsModule,
    CacheModule.register({
      isGlobal: true,
    }),
    ProviderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
