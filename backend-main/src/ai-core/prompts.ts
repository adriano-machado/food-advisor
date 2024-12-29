export const prompt = `
"IMPORTANT: Generate the response in Portuguese while following these analysis instructions.

Analyze the provided meal image and generate a detailed response in JSON format. Break down composite meals into individual ingredients/components. The response must include the following structure:

{
  "items": [
    // Each ingredient MUST be listed separately with its own nutritional values
    {
      "name": "specific ingredient name (e.g., 'grilled chicken breast', 'romaine lettuce', 'sliced avocado')",
      "description": "ONE relevant food emoji followed by food name (e.g., '🍗 chicken breast')",
      "estimated_weight_grams": "realistic weight estimate for this specific ingredient as a number",
      "confidence_score": "number between 0 and 1 indicating certainty of identification",
      "uncertainty_factors": ["array of reasons if confidence is below 0.6, empty if above"],
      "nutritional_info": {
        "calories": "calories for this specific ingredient as a number",
        "protein_grams": "protein content for this ingredient in grams as a number",
        "carbs_grams": "carbohydrate content for this ingredient in grams as a number",
        "fat_grams": "fat content for this ingredient in grams as a number",
        "fiber_grams": "fiber content for this ingredient in grams as a number"
      }
    }
  ],
  "analysis_quality": {
    "overall_confidence": "number between 0 and 1",
    "quality_issues": ["array of issues affecting analysis quality"],
    "improvement_suggestions": ["array of suggestions to get better analysis, empty if confidence is above 0.8"]
  },
  "meal_summary": {
    "total_calories": "sum of all calories as a number",
    "total_protein": "sum of all protein in grams as a number",
    "total_carbs": "sum of all carbs in grams as a number",
    "total_fat": "sum of all fat in grams as a number",
    "total_fiber": "sum of all fiber in grams as a number"
  },
  "meal_type": "one of the following: 'breakfast', 'lunch', 'dinner', or 'snack'",
  "macronutrient_distribution": {
    "protein_percentage": "percentage of calories from protein as a number",
    "carbs_percentage": "percentage of calories from carbs as a number",
    "fat_percentage": "percentage of calories from fat as a number"
  }
}

CRITICAL INSTRUCTIONS:

1. INGREDIENT BREAKDOWN RULES:
   - NEVER group ingredients together
   - Each ingredient must be listed separately with its own nutritional values
   - Be extremely specific with ingredient names
   - Include preparation method in description when visible
   - Use standard serving sizes as reference

2. EXAMPLES OF CORRECT INGREDIENT BREAKDOWN:
   For a mixed stir-fry dish (each component listed separately):
   - "chicken strips, 120g 🍗"
   - "broccoli florets, 80g 🥦"
   - "white rice, 100g 🍚"
   - "soy sauce, 15ml 🫂"

   For a breakfast plate:
   - "scrambled eggs, 2 units 🥚"
   - "whole grain toast, 2 slices 🍞"
   - "strawberries, 100g 🍓"
   - "butter, 10g 🧈"

3. WEIGHT ESTIMATION GUIDELINES:
   - Proteins: Use standard serving sizes (e.g., chicken breast 85-170g)
   - Vegetables: Estimate based on visible volume (e.g., lettuce 30-60g)
   - Grains: Use common portions (e.g., rice 50-100g cooked)
   - Fats/Oils: Be precise with small amounts (e.g., olive oil 7-15g)

4. CONFIDENCE SCORING:
   0.9-1.0: Very clear view
   - Ingredient clearly visible
   - Portion size easily determinable
   - Preparation method obvious

   0.7-0.9: Good visibility
   - Ingredient identifiable
   - Some uncertainty about exact portion
   - Preparation method visible

   0.6-0.7: Basic visibility
   - Ingredient type identifiable
   - Significant uncertainty about portion
   - Preparation method unclear

   Below 0.6: Poor visibility
   - Ingredient partially visible
   - Unable to determine portion
   - Multiple uncertainties

5. NUTRITIONAL CALCULATIONS:
   - Use standard nutritional databases
   - Calculate based on raw weight when applicable
   - Account for cooking methods
   - Include all macronutrients
   - Round to nearest whole number

6. QUALITY CONTROL:
   - Verify total calories match sum of individual items
   - Ensure macronutrient percentages sum to 100%
   - Validate all weights are realistic
   - Check that fiber content is reasonable

3. EMOJI USAGE RULES:
   - Use exactly ONE emoji per ingredient
   - Place the emoji at the end of the description
   - Choose the most representative emoji for each ingredient
   - For sauces or dressings, use 🫂 if no specific emoji exists

Return ONLY the JSON object, no additional text or formatting."
`;
