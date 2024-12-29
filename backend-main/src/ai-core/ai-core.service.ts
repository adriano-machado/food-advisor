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
      const cleanResponse = this.cleanAIResponse(rawResponse);
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

  private cleanAIResponse(rawResponse: string): string {
    let cleanedResponse = rawResponse.trim();

    // Remove markdown code block syntax if present
    if (cleanedResponse.includes('```')) {
      cleanedResponse = cleanedResponse.replace(/```(?:json)?\n?/g, '');
      cleanedResponse = cleanedResponse.replace(/\n?```/g, '');
    }

    // Remove any leading/trailing whitespace or newlines
    cleanedResponse = cleanedResponse.trim();

    try {
      // Try parsing as-is first
      const parsed = JSON.parse(cleanedResponse);

      // Ensure required fields exist with default values
      const response = {
        items: parsed.items || [],
        total_calories: parsed.total_calories || 0, // Default to 0 if missing
        meal_type: parsed.meal_type || 'snack', // Default to 'snack' if missing
      };

      return JSON.stringify(response);
    } catch (e) {
      // If parsing fails, attempt to fix truncated JSON
      const items = cleanedResponse.match(/"items":\s*\[([\s\S]*)/);
      if (items) {
        // Extract all complete items
        const itemRegex = /\s*{\s*"name":[^}]+}/g;
        const completeItems = items[1].match(itemRegex) || [];

        // Construct valid JSON with required fields
        return JSON.stringify({
          items: completeItems.map((item) => JSON.parse(item)),
          total_calories: 0, // Default value
          meal_type: 'snack', // Default value
        });
      }

      throw new Error('Unable to parse or fix the JSON response');
    }
  }
}
