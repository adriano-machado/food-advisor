import { Injectable } from '@nestjs/common';
import { OpenAIHttpService } from 'src/core/open-ai-http/open-ai-http.service';
import { z } from 'zod';
import { AIResponse, aiResponseSchema } from './ai-response.type';
import { prompt } from './prompts';
@Injectable()
export class AiCoreService {
  constructor(private readonly openAIHttpService: OpenAIHttpService) {}

  async promptWithImage(imageUrl: string): Promise<AIResponse> {
    const response = await this.openAIHttpService.promptWithImage(
      imageUrl,
      prompt,
    );
    console.log({ response });
    return this.parseAIResponse(response);
  }

  async parseAIResponse(rawResponse: string): Promise<AIResponse> {
    try {
      const cleanResponse = this.cleanOpenAIResponse(rawResponse);
      console.log({ cleanResponse });
      const jsonResponse = JSON.parse(cleanResponse);
      return aiResponseSchema.parse(jsonResponse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid AI response format: ${error.message}`);
      }
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON string: ${error.message}`);
      }
      throw error;
    }
  }

  private cleanOpenAIResponse(rawResponse: string): string {
    let cleanedResponse = rawResponse.trim();

    // Remove markdown code block syntax if present
    if (cleanedResponse.includes('```')) {
      cleanedResponse = cleanedResponse.replace(/```(?:json)?\n?/g, '');
      cleanedResponse = cleanedResponse.replace(/\n?```/g, '');
    }

    // Remove any leading/trailing whitespace or newlines
    cleanedResponse = cleanedResponse.trim();

    // Try to find the last complete object by looking for the last closing brace
    const lastBraceIndex = cleanedResponse.lastIndexOf('}');
    if (lastBraceIndex === -1) {
      throw new Error('No valid JSON object found in response');
    }

    // Take only up to the last complete object
    cleanedResponse = cleanedResponse.substring(0, lastBraceIndex + 1);

    // Validate that we have valid JSON
    try {
      JSON.parse(cleanedResponse);
      return cleanedResponse;
    } catch {
      throw new Error('Unable to parse JSON response');
    }
  }
}
