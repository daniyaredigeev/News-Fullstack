import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async toggle(articleId: string, userId: string) {
    const article = await this.prisma.article.findUnique({ where: { id: articleId } });
    if (!article || !article.published) throw new NotFoundException('Новость не найдена');

    const existing = await this.prisma.like.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });

    if (existing) {
      await this.prisma.like.delete({ where: { id: existing.id } });
      return { liked: false };
    }

    await this.prisma.like.create({ data: { userId, articleId } });
    return { liked: true };
  }

  async getLikesCount(articleId: string) {
    return this.prisma.like.count({ where: { articleId } });
  }

  async isLiked(articleId: string, userId: string) {
    const like = await this.prisma.like.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });
    return { liked: !!like };
  }
}
