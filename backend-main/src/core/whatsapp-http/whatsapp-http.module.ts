import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as http from 'http';
import * as https from 'https';
import { WhatsappHttpService } from './whatsapp-http.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('WHATSAPP_API_URL'),

        // Configure rate limiting and connection pooling
        httpAgent: new http.Agent({
          timeout: 30000,
          maxSockets: 5, // Limit concurrent connections
          keepAlive: true,
        }),
        httpsAgent: new https.Agent({
          timeout: 30000,
          maxSockets: 5,
          keepAlive: true,
        }),
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [WhatsappHttpService],
  exports: [WhatsappHttpService],
})
export class WhatsappHttpModule {}
