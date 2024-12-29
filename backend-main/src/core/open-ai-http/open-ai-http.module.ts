import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { OpenAIConfig } from '../config/open-ai.config';
import { OpenAIHttpService } from './open-ai-http.service';

@Module({
  imports: [ConfigModule.forFeature(OpenAIConfig)],
  providers: [
    {
      provide: OpenAI,
      useFactory: (configService: ConfigService) => {
        return new OpenAI({
          apiKey: configService.get<string>('OPENAI_API_KEY'),
        });
      },
      inject: [ConfigService],
    },
    OpenAIHttpService,
  ],
  exports: [OpenAIHttpService],
})
export class OpenAIHttpModule {}
