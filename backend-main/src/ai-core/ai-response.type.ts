import { z } from 'zod';

export const aiResponseSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        estimated_calories: z.number(),
      }),
    )
    .default([]),
  total_calories: z.number().default(0),
  meal_type: z.string().default('snack'),
});

export type AIResponse = z.infer<typeof aiResponseSchema>;
