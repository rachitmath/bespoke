import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MonthlyUsageGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return true; // Let JwtAuthGuard handle unauthenticated requests
    }

    // PRO plan users have unlimited generations
    if (user.plan === 'PRO') {
      return true;
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const generationCount = await this.prisma.generation.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    if (generationCount >= 3) {
      throw new HttpException(
        'Monthly free generation limit reached (3/3 generations used this month). Please upgrade to Pro for unlimited generations.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
