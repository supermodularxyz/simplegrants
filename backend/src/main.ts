import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:3001',
    credentials: true,
  });

  /** Swagger (OpenAPI) for documentation */
  const config = new DocumentBuilder()
    .setTitle('SimpleGrants API')
    .setDescription(
      "This Swagger API documents the routes for SimpleGrant's backend",
    )
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  /**
   * Prisma interferes with NestJS enableShutdownHooks. Prisma listens for
   * shutdown signals and will call process.exit() before your application
   * shutdown hooks fire. To deal with this, you would need to add a listener
   * for Prisma beforeExit event.
   */
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(3000);
  console.log(`✅ Server listening on port 3000`);
}
bootstrap();
