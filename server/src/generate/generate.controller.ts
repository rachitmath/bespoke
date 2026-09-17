import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { GenerateService } from './generate.service';
import { GenerateDto, GenerateResponse } from './dto/generate.dto';

@Controller('generate')
@UseGuards(ThrottlerGuard)
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  // Max 3 requests per 24 hours (86,400,000 ms) per IP
  @Throttle({ default: { limit: 3, ttl: 86400000 } })
  async generate(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: GenerateDto,
  ): Promise<GenerateResponse> {
    return await this.generateService.generateTailoredContent(dto);
  }
}
