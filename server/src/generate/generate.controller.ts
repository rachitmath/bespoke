import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { GenerateService } from './generate.service';
import { GenerateDto, GenerateResponse } from './dto/generate.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MonthlyUsageGuard } from './guards/monthly-usage.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('generate')
@UseGuards(JwtAuthGuard, MonthlyUsageGuard)
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async generate(
    @CurrentUser('id') userId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: GenerateDto,
  ): Promise<GenerateResponse> {
    return await this.generateService.generateTailoredContent(userId, dto);
  }
}
