import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WebhookPayloadDto } from './dto/webhook-payload.dto';
import { WhatsappMessageHandlerService } from './whatsapp-message-handler.service';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly whatsappMessageHandlerService: WhatsappMessageHandlerService,
  ) {}

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    return this.whatsappMessageHandlerService.verifyWebhook(
      mode,
      token,
      challenge,
    );
  }

  @Post()
  handleWebhook(@Body() payload: WebhookPayloadDto) {
    console.log({ payload: JSON.stringify(payload) });
    return this.whatsappMessageHandlerService.handleIncommingWhatsAppMessage(
      payload,
    );
  }
}
