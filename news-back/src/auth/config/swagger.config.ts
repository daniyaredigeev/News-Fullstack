import { DocumentBuilder } from '@nestjs/swagger';

// Проверь, чтобы было написано именно export const getSwaggerConfig
export const getSwaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('JKH News Portal')
    .setDescription('API для новостных порталов ЖКХ')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
};