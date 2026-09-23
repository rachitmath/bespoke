import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new ConflictException('An account with this email already exists. Please log in.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        hashedPassword,
        plan: 'FREE',
      },
      select: {
        id: true,
        email: true,
        plan: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id, user.email);

    return {
      user,
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.hashedPassword);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }
}
