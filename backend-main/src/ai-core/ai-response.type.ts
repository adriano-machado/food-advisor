import { z } from 'zod';

export const aiResponseSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      estimated_calories: z.number(),
    }),
  ),
  total_calories: z.number(),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
});

export type AIResponse = z.infer<typeof aiResponseSchema>;
