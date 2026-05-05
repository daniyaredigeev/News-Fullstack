import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { ComplaintFilterDto } from './dto/complaint-filter.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Authorization } from 'src/auth/decorators/authoration.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@ApiTags('Complaints')
@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  // Любой пользователь может подать жалобу (авторизация не обязательна)
  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Подать жалобу / обращение' })
  create(
    @Body() dto: CreateComplaintDto,
  ) {
    return this.complaintService.create(dto);
  }

  // Авторизованный пользователь — жалоба привязывается к аккаунту
  @Authorization()
  @Post('auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Подать жалобу от имени авторизованного пользователя' })
  createAuth(
    @Body() dto: CreateComplaintDto,
    @Authorized('id') userId: string,
  ) {
    return this.complaintService.create(dto, userId);
  }

  @Authorization()
  @Roles(Role.ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Список жалоб с фильтрами' })
  findAll(@Query() filter: ComplaintFilterDto) {
    return this.complaintService.findAll(filter);
  }

  @Authorization()
  @Roles(Role.ADMIN)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Просмотр жалобы' })
  findOne(@Param('id') id: string) {
    return this.complaintService.findOne(id);
  }
}
