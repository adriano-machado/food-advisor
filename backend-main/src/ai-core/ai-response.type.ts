import { z } from 'zod';

export const nutritionalInfoSchema = z.object({
  calories: z.number(),
  protein_grams: z.number(),
  carbs_grams: z.number(),
  fat_grams: z.number(),
  fiber_grams: z.number(),
});

export const itemSchema = z.object({
  name: z.string(),
  description: z.string(),
  estimated_weight_grams: z.number(),
  confidence_score: z.number().min(0).max(1),
  uncertainty_factors: z.array(z.string()),
  nutritional_info: nutritionalInfoSchema,
});

export const analysisQualitySchema = z.object({
  overall_confidence: z.number().min(0).max(1),
  quality_issues: z.array(z.string()),
  improvement_suggestions: z.array(z.string()),
});

export const mealSummarySchema = z.object({
  total_calories: z.number(),
  total_protein: z.number(),
  total_carbs: z.number(),
  total_fat: z.number(),
  total_fiber: z.number(),
});

export const macronutrientDistributionSchema = z.object({
  protein_percentage: z.number(),
  carbs_percentage: z.number(),
  fat_percentage: z.number(),
});

export const aiResponseSchema = z.object({
  items: z.array(itemSchema).default([]),
  analysis_quality: analysisQualitySchema,
  meal_summary: mealSummarySchema,
  macronutrient_distribution: macronutrientDistributionSchema,
});

export type AIResponse = z.infer<typeof aiResponseSchema>;
