import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AiCoreService } from 'src/ai-core/ai-core.service';
import { formatResponseToMessage } from 'src/ai-core/utils';
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

          // Process image asynchronously
          this.processImageMessage(message).catch((error) => {
            console.error('Error processing image:', error);
            this.whatsappHttpService.sendWhatsAppMessage(
              message.from,
              '❌ Sorry, I encountered an error while processing your image.',
            );
          });
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

  private async processImageMessage(message: WhatsAppMessageDto) {
    const imageUrl = await this.whatsappHttpService.downloadWhatsAppMedia(
      message.image.id,
    );

    const analysisJson = await this.aiCoreService.promptWithImage(imageUrl);
    console.log({ analysisJson });

    const formattedResponse = formatResponseToMessage(analysisJson);
    await this.whatsappHttpService.sendWhatsAppMessage(
      message.from,
      formattedResponse,
    );
  }

  async handleIncommingWhatsAppMessage(payload: WebhookPayloadDto) {
    console.log('Processing webhook payload:', JSON.stringify(payload));

    if (payload.object === 'whatsapp_business_account') {
      const from = payload.entry[0].changes[0].value.messages[0].from;
      await this.whatsappHttpService.sendWhatsAppMessage(
        from,
        'I am processing your image...',
      );
      // Process each message independently
      payload.entry.forEach((entry) => {
        entry.changes.forEach((change) => {
          (change.value.messages || []).forEach((message) => {
            // Fire and forget - don't wait
            this.processWhatsAppMessage(message).catch((error) => {
              console.error('Failed to process message:', error);
            });
          });
        });
      });
    }

    // Return immediately after initiating all processes
    return { status: 'messages_received' };
  }
}
