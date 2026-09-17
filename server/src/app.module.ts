import { Module, Get, Controller } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { GenerateModule } from './generate/generate.module';

@Controller()
export class AppController {
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      service: 'Bespoke API',
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
        ttl: 86400000, // 24 hours in milliseconds
        limit: 3,      // 3 requests per 24 hours per IP
      },
    ]),
    GenerateModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
