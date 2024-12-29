import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WhatsappWebhookConfig } from 'src/core/config/webhook.config';
import { WhatsappHttpModule } from '../core/whatsapp-http/whatsapp-http.module';
import { WebhookHandlerService } from './webhook-handler.service';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [ConfigModule.forFeature(WhatsappWebhookConfig), WhatsappHttpModule],
  controllers: [WebhookController],
  providers: [WebhookHandlerService],
})
export class WebhookModule {}
