import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WhatsappHttpService {
  private readonly apiVersion = 'v17.0';
  private readonly baseUrl: string;
  private readonly phoneNumberId: string;
  private readonly appSecret: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
    this.phoneNumberId = this.configService.get<string>(
      'WHATSAPP_PHONE_NUMBER_ID',
    );
    this.appSecret = this.configService.get<string>('WHATSAPP_APP_SECRET');
  }

  async sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/${this.phoneNumberId}/messages`,
          {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to,
            type: 'text',
            text: { body: message },
          },
          {
            headers: {
              Authorization: `Bearer ${this.appSecret}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      console.log('Message sent successfully:', response.data);
      return true;
    } catch (error: any) {
      console.error(
        'Error sending WhatsApp message:',
        error.response?.data || error.message,
      );
      return false;
    }
  }

  async downloadWhatsAppMedia(mediaId: string): Promise<string> {
    try {
      // First, get the media URL
      const mediaUrlResponse = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/${mediaId}`, {
          headers: {
            Authorization: `Bearer ${this.appSecret}`,
          },
        }),
      );

      // Download the media from the URL
      const mediaResponse = await firstValueFrom(
        this.httpService.get<ArrayBuffer>(mediaUrlResponse.data.url, {
          headers: {
            Authorization: `Bearer ${this.appSecret}`,
          },
          responseType: 'arraybuffer',
        }),
      );

      // Convert the media to base64
      const base64Image = Buffer.from(mediaResponse.data).toString('base64');
      return `data:${mediaUrlResponse.data.mime_type};base64,${base64Image}`;
    } catch (error: any) {
      console.error(
        'Error downloading WhatsApp media:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}
