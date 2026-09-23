import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setAuthCookie(res: Response, token: string) {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.authService.signup(dto);
    this.setAuthCookie(res, token);
    return {
      success: true,
      user,
      token,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.authService.login(dto);
    this.setAuthCookie(res, token);
    return {
      success: true,
      user,
      token,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
    });
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}
