import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        plan: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found.');
    }

    // Calculate current month date boundary
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [usedThisMonth, generations] = await Promise.all([
      this.prisma.generation.count({
        where: {
          userId,
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      this.prisma.generation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const monthlyLimit = user.plan === 'PRO' ? null : 3;
    const remainingThisMonth =
      user.plan === 'PRO' ? null : Math.max(0, 3 - usedThisMonth);

    return {
      user,
      usage: {
        usedThisMonth,
        monthlyLimit,
        remainingThisMonth,
      },
      generations,
    };
  }
}
