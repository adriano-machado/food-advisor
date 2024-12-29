import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AiCoreService } from 'src/ai-core/ai-core.service';
import { WhatsappWebhookConfig } from 'src/core/config/webhook.config';
import { WhatsappHttpService } from '../core/whatsapp-http/whatsapp-http.service';
import {
  WebhookPayloadDto,
  WhatsAppMessageDto,
} from './dto/webhook-payload.dto';

@Injectable()
export class WhatsappMessageHandlerService {
  constructor(
    @Inject(WhatsappWebhookConfig.KEY)
    private config: ConfigType<typeof WhatsappWebhookConfig>,
    private readonly whatsappHttpService: WhatsappHttpService,
    private readonly aiCoreService: AiCoreService,
  ) {}

  verifyWebhook(mode: string, token: string, challenge: string) {
    if (!this.config.verifyToken) {
      throw new HttpException(
        'VERIFY_TOKEN is not set in environment variables',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!mode || !token) {
      throw new HttpException(
        'Missing required parameters',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (mode === 'subscribe' && token === this.config.verifyToken) {
      return challenge;
    }

    throw new HttpException(
      'Webhook verification failed',
      HttpStatus.FORBIDDEN,
    );
  }

  async processWhatsAppMessage(message: WhatsAppMessageDto) {
    console.log(`New message from: ${message.from}`);

    try {
      switch (message.type) {
        case 'text':
          if (!message.text) break;
          await this.whatsappHttpService.sendWhatsAppMessage(
            message.from,
            'Hello World',
          );
          break;

        case 'image':
          if (!message.image) break;

          const imageUrl = await this.whatsappHttpService.downloadWhatsAppMedia(
            message.image.id,
          );

          const analysisJson =
            await this.aiCoreService.promptWithImage(imageUrl);
          console.log({ analysisJson });

          await this.whatsappHttpService.sendWhatsAppMessage(
            message.from,
            JSON.stringify(analysisJson),
          );
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
      await this.whatsappHttpService.sendWhatsAppMessage(
        message.from,
        '❌ Sorry, I encountered an error while processing your message.',
      );
    }
  }

  async handleIncommingWhatsAppMessage(payload: WebhookPayloadDto) {
    console.log('Processing webhook payload:', JSON.stringify(payload));

    if (payload.object === 'whatsapp_business_account') {
      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          if (change.value.messages) {
            for (const message of change.value.messages) {
              await this.processWhatsAppMessage(message);
            }
          }
        }
      }
    }
  }
}