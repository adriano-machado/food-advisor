import { registerAs } from '@nestjs/config';

export const WhatsappConfig = registerAs('whatsapp', () => ({
  apiVersion: 'v17.0',
  apiUrl: `https://graph.facebook.com/v17.0`,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  appSecret: process.env.WHATSAPP_APP_SECRET,
}));
