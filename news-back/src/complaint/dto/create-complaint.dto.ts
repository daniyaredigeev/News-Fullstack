import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ProblemType } from 'src/generated/prisma/client';

export class CreateComplaintDto {
  @ApiProperty({ example: 'ул. Абая, д. 10, кв. 5' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  address: string;

  @ApiProperty({
    enum: ProblemType,
    example: ProblemType.WATER,
    description: 'WATER | ELECTRICITY | HEAT | GARBAGE | OTHER',
  })
  @IsEnum(ProblemType)
  problemType: ProblemType;

  @ApiProperty({ example: '+77001234567' })
  @IsString()
  @MinLength(7)
  @MaxLength(20)
  phone: string;

  @ApiPropertyOptional({ example: 'Нет воды уже 3 дня, управляющая компания не реагирует' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ example: 1, description: 'ID города из справочника /cities' })
  @Type(() => Number)
  @IsInt()
  cityId: number;
}
