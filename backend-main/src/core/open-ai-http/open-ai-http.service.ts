import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import OpenAI from 'openai';
import { OpenAIConfig } from '../config/open-ai.config';

@Injectable()
export class OpenAIHttpService {
  constructor(
    private readonly openai: OpenAI,
    @Inject(OpenAIConfig.KEY)
    private readonly config: ConfigType<typeof OpenAIConfig>,
  ) {}

  async promptWithImage(imageUrl: string, prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: this.config.maxTokens,
      });

      return response.choices[0].message.content ?? 'No description available.';
    } catch (error) {
      console.error('Error analyzing image with OpenAI:', error);
      throw error;
    }
  }
}
