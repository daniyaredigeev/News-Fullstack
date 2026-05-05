import { Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikeService } from './like.service';
import { Authorization } from 'src/auth/decorators/authoration.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Likes')
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Authorization()
  @Post(':articleId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Поставить / убрать лайк' })
  toggle(
    @Param('articleId') articleId: string,
    @Authorized('id') userId: string,
  ) {
    return this.likeService.toggle(articleId, userId);
  }

  @Authorization()
  @Get(':articleId/me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Проверить, поставил ли текущий пользователь лайк' })
  isLiked(
    @Param('articleId') articleId: string,
    @Authorized('id') userId: string,
  ) {
    return this.likeService.isLiked(articleId, userId);
  }
}
