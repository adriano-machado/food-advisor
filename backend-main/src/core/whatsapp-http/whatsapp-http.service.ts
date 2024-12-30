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
      // Step 1: Get the media URL
      const mediaUrlResponse = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/${mediaId}`, {
          headers: {
            Authorization: `Bearer ${this.appSecret}`,
          },
        }),
      );

      // Step 2: Changed from arraybuffer to stream
      const mediaStream = await firstValueFrom(
        this.httpService.get(mediaUrlResponse.data.url, {
          headers: {
            Authorization: `Bearer ${this.appSecret}`,
          },
          responseType: 'stream',
        }),
      );

      // Step 3: New streaming implementation
      return new Promise((resolve, reject) => {
        const chunks: any[] = [];

        // Event: Receive a chunk of data
        mediaStream.data.on('data', (chunk: any) => chunks.push(chunk));

        // Event: Handle any errors during streaming
        mediaStream.data.on('error', (err: any) => reject(err));

        // Event: Stream is complete
        mediaStream.data.on('end', () => {
          // Combine all chunks into a single buffer
          const buffer = Buffer.concat(chunks);

          // Convert the final buffer to base64
          const base64Image = buffer.toString('base64');

          // Return the complete base64 string with mime type
          resolve(
            `data:${mediaUrlResponse.data.mime_type};base64,${base64Image}`,
          );
        });
      });
    } catch (error: any) {
      console.error(
        'Error downloading WhatsApp media:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}
