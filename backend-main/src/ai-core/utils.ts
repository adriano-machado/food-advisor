import { AIResponse } from './ai-response.type';

export function formatResponseToMessage(response: AIResponse): string {
  const mealHeader = `🍽️ ${response.meal_type.charAt(0).toUpperCase() + response.meal_type.slice(1)}`;

  const itemsList = response.items
    .map(
      (item) =>
        `• ${item.name} (${item.estimated_calories} cal)\n` +
        `  ${item.description}`,
    )
    .join('\n\n');

  const totalCalories = `\n\nTotal Calories: ${response.total_calories}`;

  return `${mealHeader}\n\n${itemsList}${totalCalories}`;
}
