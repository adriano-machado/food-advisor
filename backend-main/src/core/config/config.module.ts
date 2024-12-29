import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { WhatsappWebhookConfig } from './webhook.config';
import { WhatsappConfig } from './whatsapp.config';
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [WhatsappConfig, WhatsappWebhookConfig],
      envFilePath: ['.env'],
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
