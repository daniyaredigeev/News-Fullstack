import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Category } from 'src/generated/prisma/client';
import { Transform, Type } from 'class-transformer';

export class CreateNewsDto {
  @ApiProperty({ example: 'Отключение воды в Алматы' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Полный текст новости...' })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiPropertyOptional({ example: 'Краткое описание новости для превью' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/...' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ enum: Category, example: Category.WATER })
  @IsEnum(Category)
  category: Category;

  @ApiPropertyOptional({
    type: [String],
    example: ['отключения', 'аварийные'],
    description: 'Теги: отключения, плановые, аварийные, ремонт и т.д.',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 1, description: 'ID города/области из справочника' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  cityId?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  published?: boolean;
}
