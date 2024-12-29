import { AIResponse } from './ai-response.type';

export function formatResponseToMessage(response: AIResponse): string {
  // Cabeçalho da refeição com tipo e confiança
  //   const confidenceInfo = `Confiança da Análise: ${(response.analysis_quality.overall_confidence * 100).toFixed(1)}%`;

  // Detalhamento dos itens
  const itemsList = response.items
    .map((item) => {
      const confidence = (item.confidence_score * 100).toFixed(1);
      const nutrition = item.nutritional_info;

      return `• ${item.name} (${confidence}% de confiança)
  Peso: ${item.estimated_weight_grams}g
  Descrição: ${item.description}
  Nutrição:
    - Calorias: ${nutrition.calories} cal
    - Proteína: ${nutrition.protein_grams}g
    - Carboidratos: ${nutrition.carbs_grams}g
    - Gordura: ${nutrition.fat_grams}g
    - Fibra: ${nutrition.fiber_grams}g${
      item.uncertainty_factors.length > 0
        ? `\n  Observação: ${item.uncertainty_factors.join(', ')}`
        : ''
    }`;
    })
    .join('\n\n');

  // Seção de resumo da refeição
  const summary = `\n\n📊 Resumo da Refeição:
• Total de Calorias: ${response.meal_summary.total_calories} cal
• Total de Proteína: ${response.meal_summary.total_protein}g
• Total de Carboidratos: ${response.meal_summary.total_carbs}g
• Total de Gordura: ${response.meal_summary.total_fat}g
• Total de Fibra: ${response.meal_summary.total_fiber}g`;

  // Distribuição de macronutrientes
  const macros = `\n\n🎯 Distribuição de Macronutrientes:
• Proteína: ${response.macronutrient_distribution.protein_percentage.toFixed(1)}%
• Carboidratos: ${response.macronutrient_distribution.carbs_percentage.toFixed(1)}%
• Gordura: ${response.macronutrient_distribution.fat_percentage.toFixed(1)}%`;

  // Problemas de qualidade e sugestões, se houver
  const qualityInfo =
    response.analysis_quality.quality_issues.length > 0 ||
    response.analysis_quality.improvement_suggestions.length > 0
      ? `\n\n⚠️ Notas da Análise:${
          response.analysis_quality.quality_issues.length > 0
            ? `\nProblemas de Qualidade:\n${response.analysis_quality.quality_issues.map((issue) => `• ${issue}`).join('\n')}`
            : ''
        }${
          response.analysis_quality.improvement_suggestions.length > 0
            ? `\nSugestões para Melhor Análise:\n${response.analysis_quality.improvement_suggestions.map((suggestion) => `• ${suggestion}`).join('\n')}`
            : ''
        }`
      : '';

  return `🍽️ Análise da Refeição\n\n${itemsList}${summary}${macros}${qualityInfo}`;
}
