import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

// ВАЖНО: Эти файлы должны существовать физически в папке src/auth/guards/
import { JwtGuard } from './auth/guards/auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    // Настройка переменных окружения (.env)
    ConfigModule.forRoot({ isGlobal: true }),
    
    // Раздача статики (картинки для новостей ЖКХ)
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/static',
    }),
    
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Глобальная защита JWT (закрывает все роуты сразу)
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    // Глобальная проверка ролей (Admin, User)
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}