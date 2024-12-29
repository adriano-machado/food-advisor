import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { WhatsappWebhookConfig } from 'src/core/config/webhook.config';
import { WhatsappHttpService } from '../core/whatsapp-http/whatsapp-http.service';
import {
  WebhookPayloadDto,
  WhatsAppMessageDto,
} from './dto/webhook-payload.dto';

@Injectable()
export class WebhookHandlerService {
  constructor(
    @Inject(WhatsappWebhookConfig.KEY)
    private config: ConfigType<typeof WhatsappWebhookConfig>,
    private readonly whatsappHttpService: WhatsappHttpService,
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
          console.log('Text:', message.text.body);
          await this.whatsappHttpService.sendWhatsAppMessage(
            message.from,
            'Hello World',
          );
          break;

        case 'image':
          if (!message.image) break;
          console.log('Image:', {
            id: message.image.id,
            caption: message.image.caption || 'No caption',
          });
          const imageUrl = await this.whatsappHttpService.downloadWhatsAppMedia(
            message.image.id,
          );
          console.log({ imageUrl });
          await this.whatsappHttpService.sendWhatsAppMessage(
            message.from,
            'FUNCIONOU',
          );
          // Note: You'll need to inject and use aiService and formatService here
          // const analysisJson = await this.aiService.analyzeImage(imageUrl);
          // const formattedResponse = this.formatService.formatMealAnalysis(analysisJson);
          // await this.sendWhatsAppMessage(message.from, formattedResponse);
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

  async handleWebhookPayload(payload: WebhookPayloadDto) {
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
