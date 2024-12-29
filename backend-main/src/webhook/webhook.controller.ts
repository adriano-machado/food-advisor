import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WebhookPayloadDto } from './dto/webhook-payload.dto';
import { WebhookHandlerService } from './webhook-handler.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookHandlerService: WebhookHandlerService) {}

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    return this.webhookHandlerService.verifyWebhook(mode, token, challenge);
  }

  @Post()
  handleWebhook(@Body() payload: WebhookPayloadDto) {
    return this.webhookHandlerService.handleWebhookPayload(payload);
  }
}
