// Base de dados de alimentos comuns no Brasil com calorias estimadas por porção
// Usado para estimar calorias automaticamente quando o usuário digita o que comeu

export type FoodItem = {
  keywords: string[]
  caloriesPerServing: number
  servingDescription: string
}

export const foodDatabase: FoodItem[] = [
  // Arroz e grãos
  { keywords: ['arroz', 'arroz branco'], caloriesPerServing: 130, servingDescription: '1 concha (100g)' },
  { keywords: ['arroz integral'], caloriesPerServing: 110, servingDescription: '1 concha (100g)' },
  { keywords: ['feijao', 'feijão'], caloriesPerServing: 77, servingDescription: '1 concha (100g)' },
  { keywords: ['lentilha'], caloriesPerServing: 116, servingDescription: '1 concha (100g)' },
  { keywords: ['graod', 'grão de bico', 'grao de bico'], caloriesPerServing: 130, servingDescription: '1 concha (100g)' },
  { keywords: ['quinoa'], caloriesPerServing: 120, servingDescription: '1 concha (100g)' },

  // Carnes
  { keywords: ['frango', 'frango grelhado', 'peito de frango'], caloriesPerServing: 165, servingDescription: '1 filé (100g)' },
  { keywords: ['carne', 'carne bovina', 'contrafile', 'contrfilé', 'alcatra'], caloriesPerServing: 250, servingDescription: '1 bife (100g)' },
  { keywords: ['picanha'], caloriesPerServing: 310, servingDescription: '1 fatia (100g)' },
  { keywords: ['maminha'], caloriesPerServing: 230, servingDescription: '1 fatia (100g)' },
  { keywords: ['linguica', 'linguiça'], caloriesPerServing: 280, servingDescription: '1 unidade (80g)' },
  { keywords: ['bacon'], caloriesPerServing: 160, servingDescription: '2 fatias (30g)' },
  { keywords: ['porco', 'lombo'], caloriesPerServing: 240, servingDescription: '1 fatia (100g)' },
  { keywords: ['costela'], caloriesPerServing: 300, servingDescription: '1 pedaço (100g)' },

  // Peixes e frutos do mar
  { keywords: ['salmao', 'salmão'], caloriesPerServing: 208, servingDescription: '1 filé (100g)' },
  { keywords: ['tilapia', 'tilápia'], caloriesPerServing: 96, servingDescription: '1 filé (100g)' },
  { keywords: ['atum'], caloriesPerServing: 190, servingDescription: '1 lata (100g)' },
  { keywords: ['merluza'], caloriesPerServing: 90, servingDescription: '1 filé (100g)' },
  { keywords: ['sardinha'], caloriesPerServing: 208, servingDescription: '1 lata (100g)' },
  { keywords: ['camarao', 'camarão'], caloriesPerServing: 85, servingDescription: '1 porção (100g)' },
  { keywords: ['lula'], caloriesPerServing: 92, servingDescription: '1 porção (100g)' },

  // Ovos
  { keywords: ['ovo', 'ovos', 'ovo cozido', 'ovo frito'], caloriesPerServing: 78, servingDescription: '1 unidade (50g)' },
  { keywords: ['omelete'], caloriesPerServing: 154, servingDescription: '1 unidade (2 ovos)' },

  // Pães e massas
  { keywords: ['pao', 'pão', 'pao frances', 'pão francês'], caloriesPerServing: 136, servingDescription: '1 unidade (50g)' },
  { keywords: ['pao integral', 'pão integral'], caloriesPerServing: 120, servingDescription: '1 fatia (30g)' },
  { keywords: ['macarrao', 'macarrão', 'massa', 'espaguete'], caloriesPerServing: 220, servingDescription: '1 prato (150g)' },
  { keywords: ['lasanha'], caloriesPerServing: 280, servingDescription: '1 fatia (150g)' },
  { keywords: ['nhoque'], caloriesPerServing: 200, servingDescription: '1 prato (150g)' },
  { keywords: ['pizza'], caloriesPerServing: 285, servingDescription: '1 fatia (100g)' },
  { keywords: ['tapioca'], caloriesPerServing: 150, servingDescription: '1 unidade (50g)' },
  { keywords: ['crepioca'], caloriesPerServing: 180, servingDescription: '1 unidade (60g)' },

  // Laticínios
  { keywords: ['leite', 'leite integral'], caloriesPerServing: 150, servingDescription: '1 copo (240ml)' },
  { keywords: ['leite desnatado'], caloriesPerServing: 90, servingDescription: '1 copo (240ml)' },
  { keywords: ['iogurte'], caloriesPerServing: 100, servingDescription: '1 pote (150g)' },
  { keywords: ['iogurte grego', 'iogurte grego'], caloriesPerServing: 130, servingDescription: '1 pote (150g)' },
  { keywords: ['queijo', 'queijo prato', 'mussarela', 'queijo mussarela'], caloriesPerServing: 100, servingDescription: '1 fatia (30g)' },
  { keywords: ['queijo branco', 'minas'], caloriesPerServing: 75, servingDescription: '1 fatia (30g)' },
  { keywords: ['catupiry'], caloriesPerServing: 90, servingDescription: '1 colher (25g)' },
  { keywords: ['requeijao', 'requeijão'], caloriesPerServing: 70, servingDescription: '1 colher (20g)' },
  { keywords: ['manteiga'], caloriesPerServing: 72, servingDescription: '1 colher (10g)' },

  // Frutas
  { keywords: ['banana'], caloriesPerServing: 89, servingDescription: '1 unidade (100g)' },
  { keywords: ['maca', 'maçã'], caloriesPerServing: 52, servingDescription: '1 unidade (100g)' },
  { keywords: ['laranja'], caloriesPerServing: 47, servingDescription: '1 unidade (100g)' },
  { keywords: ['mamão', 'mamão papaia', 'mamao'], caloriesPerServing: 43, servingDescription: '1 fatia (100g)' },
  { keywords: ['melancia'], caloriesPerServing: 30, servingDescription: '1 fatia (100g)' },
  { keywords: ['uva'], caloriesPerServing: 67, servingDescription: '1 cacho (100g)' },
  { keywords: ['manga'], caloriesPerServing: 60, servingDescription: '1 unidade (100g)' },
  { keywords: ['abacaxi'], caloriesPerServing: 50, servingDescription: '1 fatia (100g)' },
  { keywords: ['morango'], caloriesPerServing: 32, servingDescription: '1 xícara (100g)' },
  { keywords: ['avocado', 'abacate'], caloriesPerServing: 160, servingDescription: '1/2 unidade (100g)' },
  { keywords: ['pera', 'pêra', 'pêra'], caloriesPerServing: 57, servingDescription: '1 unidade (100g)' },
  { keywords: ['kiwi'], caloriesPerServing: 42, servingDescription: '1 unidade (70g)' },
  { keywords: ['melao', 'melão'], caloriesPerServing: 36, servingDescription: '1 fatia (100g)' },

  // Vegetais
  { keywords: ['salada', 'alface', 'rucula', 'rúcula'], caloriesPerServing: 20, servingDescription: '1 prato (100g)' },
  { keywords: ['tomate'], caloriesPerServing: 18, servingDescription: '1 unidade (100g)' },
  { keywords: ['cenoura'], caloriesPerServing: 41, servingDescription: '1 unidade (100g)' },
  { keywords: ['brocolis', 'brócolis'], caloriesPerServing: 34, servingDescription: '1 porção (100g)' },
  { keywords: ['batata', 'batata cozida'], caloriesPerServing: 87, servingDescription: '1 unidade média (100g)' },
  { keywords: ['batata frita'], caloriesPerServing: 312, servingDescription: '1 porção (100g)' },
  { keywords: ['batata doce'], caloriesPerServing: 86, servingDescription: '1 unidade média (100g)' },
  { keywords: ['mandioca', 'macaxeira', 'aipim'], caloriesPerServing: 160, servingDescription: '1 porção (100g)' },
  { keywords: ['inhame'], caloriesPerServing: 118, servingDescription: '1 porção (100g)' },
  { keywords: ['abobrinha'], caloriesPerServing: 17, servingDescription: '1 unidade (100g)' },
  { keywords: ['berinjela'], caloriesPerServing: 25, servingDescription: '1 unidade (100g)' },
  { keywords: ['couve'], caloriesPerServing: 37, servingDescription: '1 porção (100g)' },
  { keywords: ['espinafre'], caloriesPerServing: 23, servingDescription: '1 porção (100g)' },

  // Café da manhã brasileiro
  { keywords: ['pao de queijo', 'pão de queijo'], caloriesPerServing: 130, servingDescription: '1 unidade (40g)' },
  { keywords: ['café', 'cafe', 'café preto', 'café preto'], caloriesPerServing: 2, servingDescription: '1 xícara (50ml)' },
  { keywords: ['café com leite', 'cafe com leite'], caloriesPerServing: 80, servingDescription: '1 xícara (200ml)' },
  { keywords: ['cappuccino'], caloriesPerServing: 120, servingDescription: '1 xícara (200ml)' },
  { keywords: ['latte'], caloriesPerServing: 190, servingDescription: '1 xícara (350ml)' },
  { keywords: ['mocha'], caloriesPerServing: 290, servingDescription: '1 xícara (350ml)' },
  { keywords: ['achocolatado', 'nescau', 'toddy'], caloriesPerServing: 80, servingDescription: '1 copo (200ml)' },

  // Lanches e salgados
  { keywords: ['coxinha'], caloriesPerServing: 200, servingDescription: '1 unidade (80g)' },
  { keywords: ['pastel'], caloriesPerServing: 230, servingDescription: '1 unidade (80g)' },
  { keywords: ['empada', 'empadinha'], caloriesPerServing: 180, servingDescription: '1 unidade (60g)' },
  { keywords: ['esfiha', 'esfirra'], caloriesPerServing: 160, servingDescription: '1 unidade (60g)' },
  { keywords: ['kibe', 'quibe'], caloriesPerServing: 200, servingDescription: '1 unidade (80g)' },
  { keywords: ['risole', 'risoles'], caloriesPerServing: 170, servingDescription: '1 unidade (60g)' },

  // Fast food
  { keywords: ['hamburguer', 'hambúrguer', 'burger', 'x-burger', 'x-salada'], caloriesPerServing: 350, servingDescription: '1 unidade (150g)' },
  { keywords: ['x-tudo', 'xtudo'], caloriesPerServing: 600, servingDescription: '1 unidade (300g)' },
  { keywords: ['cheeseburger', 'x-cheddar'], caloriesPerServing: 300, servingDescription: '1 unidade (130g)' },
  { keywords: ['cachorro quente', 'cachorro-quente'], caloriesPerServing: 230, servingDescription: '1 unidade' },
  { keywords: ['sanduiche', 'sanduíche', 'sanduiche natural'], caloriesPerServing: 250, servingDescription: '1 unidade' },
  { keywords: ['hot dog', 'hotdog'], caloriesPerServing: 280, servingDescription: '1 unidade' },

  // Sobremesas
  { keywords: ['brigadeiro'], caloriesPerServing: 100, servingDescription: '1 unidade (20g)' },
  { keywords: ['beijinho'], caloriesPerServing: 90, servingDescription: '1 unidade (20g)' },
  { keywords: ['pudim'], caloriesPerServing: 220, servingDescription: '1 fatia (100g)' },
  { keywords: ['sorvete'], caloriesPerServing: 200, servingDescription: '2 bolas (100g)' },
  { keywords: ['bolo', 'bolo de chocolate'], caloriesPerServing: 280, servingDescription: '1 fatia (100g)' },
  { keywords: ['bolo de fuba', 'bolo de fubá'], caloriesPerServing: 220, servingDescription: '1 fatia (100g)' },
  { keywords: ['musse'], caloriesPerServing: 180, servingDescription: '1 taça (100g)' },
  { keywords: ['pavê', 'pave'], caloriesPerServing: 250, servingDescription: '1 fatia (100g)' },
  { keywords: ['gelatina'], caloriesPerServing: 60, servingDescription: '1 porção (100g)' },
  { keywords: ['chocolate'], caloriesPerServing: 230, servingDescription: '1 barra (50g)' },

  // Bebidas
  { keywords: ['coca', 'coca cola', 'coca-cola', 'refrigerante'], caloriesPerServing: 140, servingDescription: '1 lata (350ml)' },
  { keywords: ['guarana', 'guaraná'], caloriesPerServing: 130, servingDescription: '1 lata (350ml)' },
  { keywords: ['suco', 'suco de laranja'], caloriesPerServing: 110, servingDescription: '1 copo (240ml)' },
  { keywords: ['suco de maracuja', 'suco de maracujá'], caloriesPerServing: 90, servingDescription: '1 copo (240ml)' },
  { keywords: ['agua', 'água'], caloriesPerServing: 0, servingDescription: '1 copo (240ml)' },
  { keywords: ['agua de coco', 'água de coco'], caloriesPerServing: 45, servingDescription: '1 copo (240ml)' },
  { keywords: ['cerveja'], caloriesPerServing: 150, servingDescription: '1 lata (350ml)' },
  { keywords: ['vinho'], caloriesPerServing: 125, servingDescription: '1 taça (120ml)' },
  { keywords: ['caipirinha'], caloriesPerServing: 200, servingDescription: '1 copo (150ml)' },
  { keywords: ['energetico', 'energético', 'red bull'], caloriesPerServing: 110, servingDescription: '1 lata (250ml)' },

  // Suplementos
  { keywords: ['whey', 'whey protein', 'proteina', 'proteína'], caloriesPerServing: 120, servingDescription: '1 scoop (30g)' },
  { keywords: ['creatina'], caloriesPerServing: 0, servingDescription: '1 scoop (5g)' },
  { keywords: ['bcaa'], caloriesPerServing: 10, servingDescription: '1 dose (5g)' },
  { keywords: ['barra de cereal', 'barra de proteina', 'barra de proteína'], caloriesPerServing: 180, servingDescription: '1 unidade (40g)' },
  { keywords: ['vitamina'], caloriesPerServing: 150, servingDescription: '1 cápsula' },

  // Comidas brasileiras
  { keywords: ['feijoada'], caloriesPerServing: 350, servingDescription: '1 prato (250g)' },
  { keywords: ['moqueca'], caloriesPerServing: 250, servingDescription: '1 porção (200g)' },
  { keywords: ['vatapa'], caloriesPerServing: 320, servingDescription: '1 porção (200g)' },
  { keywords: ['acaraje', 'acarajé'], caloriesPerServing: 300, servingDescription: '1 unidade (150g)' },
  { keywords: ['farofa'], caloriesPerServing: 180, servingDescription: '1 colher (50g)' },
  { keywords: ['vinagrete'], caloriesPerServing: 30, servingDescription: '1 colher (50g)' },
  { keywords: ['strogonoff', 'estrogonofe'], caloriesPerServing: 320, servingDescription: '1 prato (200g)' },
  { keywords: ['escondidinho'], caloriesPerServing: 280, servingDescription: '1 porção (200g)' },
  { keywords: ['bobó de camarão', 'bobo de camarao'], caloriesPerServing: 290, servingDescription: '1 prato (200g)' },

  // Outros
  { keywords: ['pipoca'], caloriesPerServing: 80, servingDescription: '1 xícara (20g)' },
  { keywords: ['biscoito', 'bolacha'], caloriesPerServing: 50, servingDescription: '1 unidade (10g)' },
  { keywords: ['salgadinho', 'doritos', 'ruffles'], caloriesPerServing: 160, servingDescription: '1 pacote (50g)' },
  { keywords: ['mel'], caloriesPerServing: 64, servingDescription: '1 colher (20g)' },
  { keywords: ['pasta de amendoim', 'pasta', 'amendoim'], caloriesPerServing: 190, servingDescription: '1 colher (30g)' },
  { keywords: ['granola'], caloriesPerServing: 200, servingDescription: '1 xícara (50g)' },
  { keywords: ['aveia'], caloriesPerServing: 150, servingDescription: '1 xícara (40g)' },
  { keywords: ['castanha', 'castanhas'], caloriesPerServing: 190, servingDescription: '1 punhado (30g)' },
  { keywords: ['nozes'], caloriesPerServing: 185, servingDescription: '1 punhado (30g)' },
  { keywords: ['uva passa'], caloriesPerServing: 130, servingDescription: '1 colher (30g)' },
]

// Normaliza texto: remove acentos e converte para minúsculas
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

// Estima calorias com base no nome do alimento digitado
export function estimateCalories(foodName: string): { calories: number; matchedFood?: FoodItem; confidence: 'high' | 'low' } {
  const normalized = normalize(foodName)

  // Busca exata primeiro
  for (const food of foodDatabase) {
    for (const kw of food.keywords) {
      if (normalize(kw) === normalized) {
        return { calories: food.caloriesPerServing, matchedFood: food, confidence: 'high' }
      }
    }
  }

  // Busca parcial - se alguma keyword está contida no texto ou vice-versa
  for (const food of foodDatabase) {
    for (const kw of food.keywords) {
      const nkw = normalize(kw)
      if (normalized.includes(nkw) || nkw.includes(normalized)) {
        return { calories: food.caloriesPerServing, matchedFood: food, confidence: 'high' }
      }
    }
  }

  // Busca por palavras individuais
  const words = normalized.split(/\s+/)
  for (const food of foodDatabase) {
    for (const kw of food.keywords) {
      const nkw = normalize(kw)
      if (words.some((w) => w.length > 2 && nkw.includes(w))) {
        return { calories: food.caloriesPerServing, matchedFood: food, confidence: 'low' }
      }
    }
  }

  // Não encontrou - retorna estimativa genérica
  return { calories: 200, confidence: 'low' }
}
