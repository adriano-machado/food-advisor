import { registerAs } from '@nestjs/config';

export const OpenAIConfig = registerAs('open-ai', () => ({
  apiKey: process.env.OPENAI_API_KEY || '',
  apiUrl: 'https://api.openai.com/v1',
  model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '200', 10),
}));
