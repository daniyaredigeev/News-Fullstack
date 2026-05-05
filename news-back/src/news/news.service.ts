import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsFilterDto } from './dto/news-filter.dto';
import { Role } from 'src/auth/enums/role.enum';

const ARTICLE_INCLUDE = {
  city: true,
  author: { select: { id: true, name: true } },
  _count: { select: { likes: true, comments: true } },
} as const;

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: NewsFilterDto) {
    const { cityId, category, tag, search, page = 1, limit = 10 } = filter;

    const where: any = { published: true };
    if (cityId) where.cityId = cityId;
    if (category) where.category = category;
    if (tag) where.tags = { has: tag };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        include: ARTICLE_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      articles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllAdmin(filter: NewsFilterDto) {
    const { cityId, category, tag, search, page = 1, limit = 10 } = filter;

    const where: any = {};
    if (cityId) where.cityId = cityId;
    if (category) where.category = category;
    if (tag) where.tags = { has: tag };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        include: ARTICLE_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      articles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        ...ARTICLE_INCLUDE,
        comments: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!article || !article.published) throw new NotFoundException('Новость не найдена');

    await this.prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    });

    return article;
  }

  async findById(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: ARTICLE_INCLUDE,
    });
    if (!article) throw new NotFoundException('Новость не найдена');
    return article;
  }

  async create(authorId: string, dto: CreateNewsDto) {
    const slug = await this.generateSlug(dto.title);

    return this.prisma.article.create({
      data: {
        title: dto.title,
        content: dto.content,
        excerpt: dto.excerpt,
        imageUrl: dto.imageUrl,
        slug,
        category: dto.category,
        tags: dto.tags ?? [],
        cityId: dto.cityId ?? null,
        published: dto.published ?? false,
        authorId,
      },
      include: ARTICLE_INCLUDE,
    });
  }

  async update(id: string, userId: string, userRole: Role, dto: UpdateNewsDto) {
    const article = await this.findById(id);

    if (userRole === Role.ADMIN && article.authorId !== userId) {
      throw new ForbiddenException('Вы можете редактировать только свои новости');
    }

    const data: any = { ...dto };
    if (dto.title) {
      data.slug = await this.generateSlug(dto.title, id);
    }

    return this.prisma.article.update({
      where: { id },
      data,
      include: ARTICLE_INCLUDE,
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    const article = await this.findById(id);

    if (userRole === Role.ADMIN && article.authorId !== userId) {
      throw new ForbiddenException('Вы можете удалять только свои новости');
    }

    await this.prisma.article.delete({ where: { id } });
    return { message: 'Новость удалена' };
  }

  private async generateSlug(title: string, excludeId?: string): Promise<string> {
    const base = slugify(title, { lower: true, strict: true, locale: 'ru' });
    let slug = base;
    let counter = 1;

    while (true) {
      const existing = await this.prisma.article.findUnique({ where: { slug } });
      if (!existing || existing.id === excludeId) break;
      slug = `${base}-${counter++}`;
    }

    return slug;
  }
}
