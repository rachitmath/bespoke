import { Module, Get, Controller } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GenerateModule } from './generate/generate.module';

@Controller()
export class AppController {
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      service: 'Bespoke SaaS API',
      timestamp: new Date().toISOString(),
    };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 1 minute window for DDoS protection
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    GenerateModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
