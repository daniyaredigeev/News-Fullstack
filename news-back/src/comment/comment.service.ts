import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async findByArticle(articleId: string) {
    const article = await this.prisma.article.findUnique({ where: { id: articleId } });
    if (!article || !article.published) throw new NotFoundException('Новость не найдена');

    return this.prisma.comment.findMany({
      where: { articleId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(articleId: string, userId: string, dto: CreateCommentDto) {
    const article = await this.prisma.article.findUnique({ where: { id: articleId } });
    if (!article || !article.published) throw new NotFoundException('Новость не найдена');

    return this.prisma.comment.create({
      data: { content: dto.content, userId, articleId },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async remove(commentId: string, userId: string, userRole: Role) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Комментарий не найден');

    const isOwner = comment.userId === userId;
    const isAdmin = userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Нет прав для удаления этого комментария');
    }

    await this.prisma.comment.delete({ where: { id: commentId } });
    return { message: 'Комментарий удалён' };
  }
}
