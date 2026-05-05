import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Важная новость, спасибо!' })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;
}
