import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Authorization } from 'src/auth/decorators/authoration.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { User } from 'src/generated/prisma/client';
import { Role } from 'src/auth/enums/role.enum';

@ApiTags('Comments')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Get(':articleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получить комментарии к новости' })
  findByArticle(@Param('articleId') articleId: string) {
    return this.commentService.findByArticle(articleId);
  }

  @Authorization()
  @Post(':articleId')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавить комментарий' })
  create(
    @Param('articleId') articleId: string,
    @Authorized('id') userId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.create(articleId, userId, dto);
  }

  @Authorization()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить комментарий (свой или админ)' })
  remove(
    @Param('id') id: string,
    @Authorized() user: User,
  ) {
    return this.commentService.remove(id, user.id, user.role as Role);
  }
}
