import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/register.dto';
import { LoginRequest } from './dto/login.dto';
import type { Request, Response } from 'express';
import { ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Authorization } from './decorators/authoration.decorator';
import { Authorized } from './decorators/authorized.decorator';
import { Public } from './decorators/public.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public() // помечаем этот маршрут как публичный, чтобы JwtGuard его пропускал
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterRequest,
  ) {
    return this.authService.register(res, dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginRequest,
  ) {
    return this.authService.login(res, dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req, res);
  }
 
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @UseGuards(AuthGuard('jwt'))
/* @UseGuards(AuthGuard('jwt')) */
@Authorization() //создали свой декоратор для авторизации, который использует JwtGuard
 @Get('me')
 @HttpCode(HttpStatus.OK)
 async me(@Authorized('id') id: string) {   //async me(@Req() req: Request) {
   return { id }; //req.user.id;
 }









}