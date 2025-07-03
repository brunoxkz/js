export function calculateDivineCode(day: string, month: string, year: string, color: string = '', favoriteNumber: number = 0): string {
  const dayNum = parseInt(day);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  
  // Algoritmo aprimorado que incorpora cor e número favorito
  const colorMultiplier = getColorMultiplier(color);
  const sum = dayNum + monthNum + (yearNum % 100);
  
  // Incorpora o número favorito e a cor no cálculo
  const code1 = ((dayNum * 3 + favoriteNumber) % 9) + 1;
  const code2 = ((monthNum * 7 + colorMultiplier) % 9) + 1;
  const code3 = ((sum * 2 + favoriteNumber + colorMultiplier) % 9) + 1;
  
  return `${code1}-${code2}-${code3}`;
}

function getColorMultiplier(color: string): number {
  const colorValues: Record<string, number> = {
    red: 1,
    blue: 2,
    green: 3,
    yellow: 4,
    purple: 5,
    pink: 6,
    orange: 7,
    teal: 8
  };
  return colorValues[color] || 0;
}

export function getCodeMeaning(code: string): string {
  const codes: Record<string, string> = {
    '1-1-1': 'Liderança Divina e Manifestação Suprema',
    '1-2-3': 'Criatividade Espiritual e Abundância Crescente',
    '2-3-4': 'Harmonia Financeira e Propósito Equilibrado',
    '3-4-5': 'Transformação Poderosa e Crescimento Espiritual',
    '4-5-6': 'Estabilidade Divina e Prosperidade Sólida',
    '5-6-7': 'Liberdade Financeira e Ministério Expansivo',
    '6-7-8': 'Responsabilidade Sagrada e Multiplicação',
    '7-8-9': 'Perfeição Espiritual e Realização Completa',
    '8-9-1': 'Poder Material e Sabedoria Divina',
    '9-1-2': 'Compaixão Universal e Serviço Divino'
  };
  
  return codes[code] || 'Propósito Único e Extraordinário de Manifestação';
}

export function getCodePercentage(code: string): number {
  // Simula uma porcentagem "rara" baseada no código
  const hash = code.split('-').reduce((acc, num) => acc + parseInt(num), 0);
  return Math.max(3, Math.min(12, hash % 10 + 3));
}

export function getDiagnosisContent(diagnosis: DiagnosisType, code: string) {
  const contents = {
    'financial-ceiling': {
      title: 'EL SÍNDROME DEL TECHO INVISIBLE',
      description: `Tu Código Divino ${code} revela que estás experimentando un patrón específico: el "Techo Invisible de Prosperidad".`,
      characteristics: [
        'Oras y te esfuerzas constantemente sin ver resultados proporcionales',
        'Sientes vergüenza por tu situación actual a pesar de tu fidelidad',
        'Experimentas ciclos de avance seguidos de retrocesos inesperados',
        'Tienes un deseo profundo de servir a Dios con libertad pero te sientes limitado'
      ],
      percentage: '78%',
      potential: '85-95%',
      current: '30-40%'
    },
    'purpose-misalignment': {
      title: 'DESALINEACIÓN DEL PROPÓSITO DIVINO',
      description: `Tu Código ${code} indica una desconexión entre tu propósito divino y tu realidad financiera actual.`,
      characteristics: [
        'Cuestionas si estás en el centro de la voluntad de Dios',
        'Sientes que tu potencial no se está manifestando completamente',
        'Experimentas confusión sobre cuál es tu verdadero llamado',
        'Hay una brecha entre lo que sabes y lo que puedes aplicar'
      ],
      percentage: '65%',
      potential: '90-98%',
      current: '25-35%'
    },
    'generational-curse': {
      title: 'PATRÓN GENERACIONAL DE LIMITACIÓN',
      description: `Tu Código ${code} revela la presencia de un patrón generacional que está limitando tu prosperidad.`,
      characteristics: [
        'Repites patrones financieros de generaciones anteriores',
        'Sientes que hay fuerzas invisibles trabajando en tu contra',
        'Experimentas un sabotaje interno que no puedes explicar',
        'Hay un "techo familiar" que parece imposible de romper'
      ],
      percentage: '52%',
      potential: '88-96%',
      current: '20-30%'
    },
    'divine-timing': {
      title: 'DESINCRONIZACIÓN DIVINA',
      description: `Tu Código ${code} muestra que estás fuera del tiempo divino perfecto para tu prosperidad.`,
      characteristics: [
        'Las oportunidades aparecen pero no logras aprovecharlas',
        'Sientes que siempre llegas tarde o temprano a las bendiciones',
        'Experimentas frustración por la aparente falta de timing',
        'Hay un desajuste entre tu preparación y las oportunidades'
      ],
      percentage: '43%',
      potential: '92-99%',
      current: '35-45%'
    },
    'spiritual-blockage': {
      title: 'BLOQUEO ESPIRITUAL PROFUNDO',
      description: `Tu Código ${code} indica la presencia de bloqueos espirituales que afectan tu prosperidad.`,
      characteristics: [
        'Sientes resistencia espiritual a tu crecimiento financiero',
        'Experimentas culpa o vergüenza relacionada con la prosperidad',
        'Hay creencias limitantes profundamente arraigadas',
        'Sientes que no mereces la abundancia que Dios tiene para ti'
      ],
      percentage: '39%',
      potential: '87-94%',
      current: '15-25%'
    }
  };

  return contents[diagnosis];
}

import { DiagnosisType } from '../types';