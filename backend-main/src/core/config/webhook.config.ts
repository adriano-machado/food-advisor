import { registerAs } from '@nestjs/config';

export const WhatsappWebhookConfig = registerAs('webhook', () => ({
  verifyToken: process.env.VERIFY_TOKEN || '',
}));
