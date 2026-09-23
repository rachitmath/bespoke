import { Module } from '@nestjs/common';
import { GenerateController } from './generate.controller';
import { GenerateService } from './generate.service';
import { MonthlyUsageGuard } from './guards/monthly-usage.guard';

@Module({
  controllers: [GenerateController],
  providers: [GenerateService, MonthlyUsageGuard],
  exports: [GenerateService],
})
export class GenerateModule {}
