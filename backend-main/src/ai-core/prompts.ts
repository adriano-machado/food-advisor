export const prompt = `
"Analyze the provided meal image and generate a detailed response in JSON format. The response must include the following structure:

json
Copy code
{
  "items": [
    {
      "name": "item name (e.g., scrambled eggs, toast, apple)",
      "description": "brief description of the item, including key ingredients or characteristics",
      "estimated_calories": "realistic calorie estimate as a number"
    }
  ],
  "total_calories": "sum of all item calorie estimates as a number",
  "meal_type": "one of the following: 'breakfast', 'lunch', 'dinner', or 'snack' based on common meal categorization"
}
Instructions:

Ensure item names are specific and descriptive.
Provide realistic calorie estimates based on standard nutritional data.
Categorize the meal type accurately based on the items present.
Be precise and avoid overestimations or ambiguities.
If certain details are unclear or ambiguous in the image, make a reasonable assumption and indicate the assumption in your analysis."
`;
