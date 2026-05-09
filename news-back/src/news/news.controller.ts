import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsFilterDto } from './dto/news-filter.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Authorization } from 'src/auth/decorators/authoration.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { User } from 'src/generated/prisma/client';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // ── Админ роуты — ВСЕГДА ВЫШЕ динамических (:slug, :id) ───────────────────

  @Authorization()
  @Roles(Role.ADMIN)
  @Get('admin/all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Все новости включая неопубликованные' })
  findAllAdmin(@Query() filter: NewsFilterDto) {
    return this.newsService.findAllAdmin(filter);
  }

  @Authorization()
  @Roles(Role.ADMIN)
  @Get('admin/one/:id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Получить одну новость по ID' })
  findOneAdmin(@Param('id') id: string) {
    return this.newsService.findById(id);
  }

  @Authorization()
  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Создать новость' })
  create(
    @Authorized('id') authorId: string,
    @Body() dto: CreateNewsDto,
  ) {
    return this.newsService.create(authorId, dto);
  }

  @Authorization()
  @Roles(Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Обновить новость' })
  update(
    @Param('id') id: string,
    @Authorized() user: User,
    @Body() dto: UpdateNewsDto,
  ) {
    return this.newsService.update(id, user.id, user.role as Role, dto);
  }

  @Authorization()
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Удалить новость' })
  remove(
    @Param('id') id: string,
    @Authorized() user: User,
  ) {
    return this.newsService.remove(id, user.id, user.role as Role);
  }

  // ── Публичные — динамические параметры идут последними ────────────────────

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Лента новостей с фильтрами' })
  findAll(@Query() filter: NewsFilterDto) {
    return this.newsService.findAll(filter);
  }

  @Public()
  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получить новость по slug (увеличивает просмотры)' })
  findBySlug(@Param('slug') slug: string) {
    return this.newsService.findBySlug(slug);
  }
}