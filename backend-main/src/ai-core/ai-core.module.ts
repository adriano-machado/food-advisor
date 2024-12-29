import { Module } from '@nestjs/common';
import { OpenAIHttpModule } from 'src/core/open-ai-http/open-ai-http.module';
import { AiCoreService } from './ai-core.service';

@Module({
  imports: [OpenAIHttpModule],
  providers: [AiCoreService],
  exports: [AiCoreService],
})
export class AiCoreModule {}
