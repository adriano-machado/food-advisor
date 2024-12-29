import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiCoreModule } from 'src/ai-core/ai-core.module';
import { WhatsappWebhookConfig } from 'src/core/config/webhook.config';
import { WhatsappHttpModule } from '../core/whatsapp-http/whatsapp-http.module';
import { WebhookController } from './webhook.controller';
import { WhatsappMessageHandlerService } from './whatsapp-message-handler.service';

@Module({
  imports: [
    ConfigModule.forFeature(WhatsappWebhookConfig),
    WhatsappHttpModule,
    AiCoreModule,
  ],
  controllers: [WebhookController],
  providers: [WhatsappMessageHandlerService],
})
export class WebhookModule {}
