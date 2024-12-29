import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './core/config/config.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [ConfigModule, WebhookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
