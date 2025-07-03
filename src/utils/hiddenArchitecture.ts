import { DiagnosisType } from '../types';

// Hidden Architecture System - Alen Sultanic Method
export class HiddenArchitectureEngine {
  private static progressionStages = {
    positive: {
      stage: 'desire_amplification',
      purpose: 'Create hope and desire',
      psychological_effect: 'Builds anticipation and emotional investment',
      feedback_pattern: 'Reinforce divine potential and unique gifts'
    },
    neutral: {
      stage: 'problem_identification', 
      purpose: 'Establish current reality',
      psychological_effect: 'Creates awareness of gap between potential and reality',
      feedback_pattern: 'Acknowledge struggles while maintaining hope'
    },
    negative: {
      stage: 'pain_agitation',
      purpose: 'Intensify urgency for solution',
      psychological_effect: 'Creates emotional urgency and fear of loss',
      feedback_pattern: 'Validate pain while introducing solution possibility'
    }
  };

  static calculatePsychologicalProfile(answers: Record<string, string>): {
    dominantPain: string;
    urgencyLevel: number;
    emotionalTriggers: string[];
    personalizedDiagnosis: DiagnosisType;
    customizedOffer: string;
  } {
    const answerValues = Object.values(answers);
    
    // Analyze answer patterns for psychological profiling
    const painPoints = {
      'prayer-ceiling': answerValues.filter(a => a.includes('prayer') || a.includes('ceiling')).length,
      'shame-guilt': answerValues.filter(a => a.includes('shame') || a.includes('guilt')).length,
      'family-pressure': answerValues.filter(a => a.includes('family') || a.includes('provide')).length,
      'divine-doubt': answerValues.filter(a => a.includes('doubt') || a.includes('god')).length,
      'time-pressure': answerValues.filter(a => a.includes('time') || a.includes('age')).length
    };

    const dominantPain = Object.entries(painPoints)
      .sort(([,a], [,b]) => b - a)[0][0];

    // Calculate urgency based on negative answers
    const negativeAnswers = answerValues.filter(a => 
      a.includes('stress') || a.includes('shame') || a.includes('ceiling') || 
      a.includes('sabotage') || a.includes('doubt') || a.includes('frustration')
    ).length;

    const urgencyLevel = Math.min(100, (negativeAnswers / answerValues.length) * 100 + 30);

    // Determine emotional triggers
    const emotionalTriggers = [];
    if (painPoints['shame-guilt'] > 0) emotionalTriggers.push('shame_relief');
    if (painPoints['family-pressure'] > 0) emotionalTriggers.push('provider_identity');
    if (painPoints['divine-doubt'] > 0) emotionalTriggers.push('spiritual_validation');
    if (painPoints['time-pressure'] > 0) emotionalTriggers.push('urgency_scarcity');

    // Determine diagnosis based on dominant patterns
    let personalizedDiagnosis: DiagnosisType = 'financial-ceiling';
    
    if (dominantPain === 'prayer-ceiling') personalizedDiagnosis = 'financial-ceiling';
    else if (dominantPain === 'divine-doubt') personalizedDiagnosis = 'purpose-misalignment';
    else if (dominantPain === 'family-pressure') personalizedDiagnosis = 'generational-curse';
    else if (dominantPain === 'time-pressure') personalizedDiagnosis = 'divine-timing';
    else personalizedDiagnosis = 'spiritual-blockage';

    // Customize offer based on profile
    const customizedOffer = this.generateCustomOffer(dominantPain, urgencyLevel, emotionalTriggers);

    return {
      dominantPain,
      urgencyLevel,
      emotionalTriggers,
      personalizedDiagnosis,
      customizedOffer
    };
  }

  private static generateCustomOffer(
    dominantPain: string, 
    urgencyLevel: number, 
    triggers: string[]
  ): string {
    const offerTemplates = {
      'prayer-ceiling': 'Plan de Activación Divina: Rompe el Techo de Oración en 7 Días',
      'shame-guilt': 'Protocolo de Liberación: Transforma la Vergüenza en Prosperidad Divina',
      'family-pressure': 'Sistema de Provisión Familiar: Conviértete en el Proveedor que Dios Diseñó',
      'divine-doubt': 'Revelación de Propósito: Descubre Tu Llamado Financiero Divino',
      'time-pressure': 'Acelerador de Manifestación: Recupera el Tiempo Perdido en 30 Días'
    };

    return offerTemplates[dominantPain as keyof typeof offerTemplates] || offerTemplates['prayer-ceiling'];
  }

  static generatePersonalizedFeedback(
    questionType: 'positive' | 'neutral' | 'negative',
    answer: string,
    divineCode: string,
    questionIndex: number
  ): string {
    const stage = this.progressionStages[questionType];
    
    const feedbackTemplates = {
      positive: [
        `¡Extraordinario! Tu Código ${divineCode} revela una alineación perfecta con ${this.extractDesireFromAnswer(answer)}. Esto confirma que Dios ha puesto algo muy específico en tu corazón...`,
        `Increíble... Tu respuesta activa una frecuencia especial en tu Código ${divineCode}. Esto explica por qué sientes esa llamada tan fuerte hacia ${this.extractDesireFromAnswer(answer)}...`,
        `¡Poderoso! Tu Código ${divineCode} está resonando con una energía divina única. Tu deseo de ${this.extractDesireFromAnswer(answer)} no es casualidad, es tu destino manifestándose...`
      ],
      neutral: [
        `Entiendo perfectamente... Tu Código ${divineCode} combinado con esta situación revela un patrón muy específico. Muchas personas con tu mismo código experimentan exactamente esto...`,
        `Esto es muy revelador... Tu Código ${divineCode} está mostrando señales claras de un 'Techo Invisible' que está limitando tu potencial. Pero hay esperanza...`,
        `Tu honestidad es poderosa... Tu Código ${divineCode} indica que has estado luchando contra fuerzas que no puedes ver. Estamos muy cerca de identificar exactamente qué es...`
      ],
      negative: [
        `Ahora todo tiene sentido... Tu Código ${divineCode} revela exactamente por qué has estado experimentando esto. No es tu culpa, es un patrón específico que podemos romper...`,
        `Esto confirma nuestro diagnóstico... Tu Código ${divineCode} está siendo bloqueado por fuerzas muy específicas. Pero tengo una noticia increíble para ti...`,
        `Tu transparencia es el primer paso hacia la libertad... Tu Código ${divineCode} muestra que has estado bajo un 'Ataque Espiritual' dirigido. Pero Dios me ha mostrado la solución exacta...`
      ]
    };

    const templates = feedbackTemplates[questionType];
    return templates[questionIndex % templates.length];
  }

  private static extractDesireFromAnswer(answer: string): string {
    const desireMap: Record<string, string> = {
      'divine-service': 'servir a Dios con libertad total',
      'family-legacy': 'asegurar el futuro de tu familia',
      'blessing-channel': 'ser canal de bendiciones',
      'divine-purpose': 'desarrollar tu ministerio divino',
      'ministry-focus': 'dedicarte al ministerio',
      'financial-freedom': 'la libertad financiera completa',
      'generosity': 'bendecir a otros abundantemente',
      'divine-timing': 'manifestar tu proyecto divino'
    };

    return desireMap[answer] || 'tu propósito divino';
  }

  static generateDiagnosisContent(
    diagnosis: DiagnosisType, 
    divineCode: string,
    psychProfile: any
  ) {
    const baseContent = {
      'financial-ceiling': {
        title: 'EL SÍNDROME DEL TECHO INVISIBLE FINANCIERO',
        description: `Tu Código Divino ${divineCode} revela que estás experimentando el patrón más común pero más devastador: el "Techo Invisible de Prosperidad". Este no es un problema de fe o esfuerzo, es un bloqueo espiritual específico que afecta al 78% de los cristianos con códigos similares al tuyo.`,
        characteristics: [
          'Oras fervientemente pero los resultados financieros no llegan proporcionalmente',
          'Sientes vergüenza profunda por tu situación a pesar de tu fidelidad a Dios',
          'Experimentas ciclos frustrantes: avanzas y luego retrocedes sin explicación',
          'Tienes un llamado claro pero te sientes limitado por la falta de recursos',
          'Otros a tu alrededor prosperan mientras tú luchas con lo básico'
        ],
        percentage: '78%',
        potential: '85-95%',
        current: '30-40%',
        urgentMessage: 'Este techo se fortalece cada día que no se rompe. Después de los 45 años, se vuelve casi imposible de quebrar sin intervención divina específica.'
      },
      'purpose-misalignment': {
        title: 'DESALINEACIÓN CRÍTICA DEL PROPÓSITO DIVINO',
        description: `Tu Código ${divineCode} indica una desconexión peligrosa entre tu propósito divino y tu realidad financiera. Esto crea un "cortocircuito espiritual" que bloquea tanto tu prosperidad como tu paz interior.`,
        characteristics: [
          'Cuestionas constantemente si estás en el centro de la voluntad de Dios',
          'Sientes que tu potencial está "dormido" y no sabes cómo despertarlo',
          'Experimentas confusión sobre cuál es tu verdadero llamado financiero',
          'Hay una brecha dolorosa entre lo que sabes y lo que puedes manifestar',
          'Te sientes como si estuvieras viviendo la vida de otra persona'
        ],
        percentage: '65%',
        potential: '90-98%',
        current: '25-35%',
        urgentMessage: 'La desalineación se profundiza con el tiempo. Cada año fuera de tu propósito divino reduce tu capacidad de manifestación en un 15%.'
      },
      'generational-curse': {
        title: 'MALDICIÓN GENERACIONAL DE LIMITACIÓN FINANCIERA',
        description: `Tu Código ${divineCode} revela la presencia activa de un patrón generacional que ha estado limitando a tu familia por décadas. Este no es solo un problema personal, es una batalla espiritual heredada.`,
        characteristics: [
          'Repites exactamente los mismos patrones financieros de tus padres/abuelos',
          'Sientes fuerzas invisibles que sabotean tus esfuerzos de prosperidad',
          'Experimentas un "sabotaje interno" que no puedes explicar racionalmente',
          'Hay un "techo familiar" que parece imposible de romper sin importar tu esfuerzo',
          'Otros en tu familia han experimentado las mismas limitaciones misteriosas'
        ],
        percentage: '52%',
        potential: '88-96%',
        current: '20-30%',
        urgentMessage: 'Las maldiciones generacionales se fortalecen cada generación. Si no se rompe ahora, se transmitirá automáticamente a tus hijos.'
      },
      'divine-timing': {
        title: 'DESINCRONIZACIÓN CRÍTICA CON EL TIEMPO DIVINO',
        description: `Tu Código ${divineCode} muestra que estás completamente fuera del tiempo divino perfecto para tu prosperidad. Es como tener la llave correcta pero usarla en el momento equivocado.`,
        characteristics: [
          'Las oportunidades aparecen pero no logras aprovecharlas completamente',
          'Sientes que siempre llegas "tarde" o "temprano" a las bendiciones',
          'Experimentas frustración constante por la falta de timing perfecto',
          'Hay un desajuste doloroso entre tu preparación y las oportunidades',
          'Otros con menos preparación logran lo que tú no puedes alcanzar'
        ],
        percentage: '43%',
        potential: '92-99%',
        current: '35-45%',
        urgentMessage: 'Los "momentos divinos" son limitados. Cada oportunidad perdida reduce las siguientes en un 25%. El tiempo se está agotando.'
      },
      'spiritual-blockage': {
        title: 'BLOQUEO ESPIRITUAL PROFUNDO DE PROSPERIDAD',
        description: `Tu Código ${divineCode} indica la presencia de bloqueos espirituales profundos que están afectando directamente tu capacidad de recibir la abundancia que Dios tiene preparada para ti.`,
        characteristics: [
          'Sientes resistencia espiritual inexplicable hacia el crecimiento financiero',
          'Experimentas culpa o vergüenza profunda relacionada con la prosperidad',
          'Tienes creencias limitantes sobre el dinero profundamente arraigadas',
          'Sientes que "no mereces" la abundancia que Dios tiene para ti',
          'Hay una batalla interna constante entre tu deseo de prosperar y tu espiritualidad'
        ],
        percentage: '39%',
        potential: '87-94%',
        current: '15-25%',
        urgentMessage: 'Los bloqueos espirituales se calcifican con el tiempo. Después de los 40 años, requieren intervención divina intensiva para ser removidos.'
      }
    };

    const content = baseContent[diagnosis];
    
    // Personalize based on psychological profile
    if (psychProfile.urgencyLevel > 70) {
      content.urgentMessage = `🚨 CRÍTICO: ${content.urgentMessage} Tu nivel de urgencia es del ${Math.round(psychProfile.urgencyLevel)}% - esto requiere acción inmediata.`;
    }

    return content;
  }

  static generatePersonalizedOffer(
    divineCode: string,
    diagnosis: DiagnosisType,
    psychProfile: any
  ) {
    const baseOffer = {
      title: `TU PLAN DIVINO DE ACTIVACIÓN DE 7 DÍAS`,
      subtitle: `Específicamente Diseñado Para Tu Código ${divineCode} y Tu Patrón de Bloqueo`,
      
      mainModules: [
        {
          name: `Módulo 1: Activación del Código ${divineCode}`,
          description: 'Protocolo específico para activar tu código divino único',
          value: '$297'
        },
        {
          name: `Módulo 2: Rompedor de ${this.getDiagnosisName(diagnosis)}`,
          description: 'Sistema dirigido para eliminar tu patrón específico de bloqueo',
          value: '$397'
        },
        {
          name: 'Módulo 3: Manifestación Acelerada de 7 Días',
          description: 'Técnicas avanzadas para ver resultados tangibles en una semana',
          value: '$197'
        }
      ],

      strategicBonuses: [
        {
          name: `Oraciones de Activación Personalizadas para Código ${divineCode}`,
          description: 'Oraciones específicas que resuenan con tu frecuencia divina única',
          value: '$197'
        },
        {
          name: `Diagnóstico Personalizado de ${this.getDiagnosisName(diagnosis)}`,
          description: 'Análisis profundo de tu patrón específico y plan de liberación',
          value: '$297'
        },
        {
          name: 'Kit de Herramientas de Manifestación Divina',
          description: 'Herramientas prácticas para acelerar tu transformación',
          value: '$147'
        }
      ],

      testimonials: this.generatePersonalizedTestimonials(divineCode, diagnosis),
      
      guarantees: [
        {
          name: 'Garantía de Manifestación de 7 Días',
          description: 'Si no ves cambios tangibles en 7 días, devolvemos tu inversión + $50 por las molestias'
        },
        {
          name: 'Garantía de Alineación Bíblica Total',
          description: '100% basado en principios bíblicos de prosperidad - sin técnicas mundanas'
        }
      ],

      urgencyElements: {
        timer: psychProfile.urgencyLevel > 70 ? 24 : 48, // hours
        scarcity: `Solo ${Math.floor(Math.random() * 15) + 10} espacios disponibles para implementación grupal`,
        bonusExpiration: 'Los bónus estratégicos desaparecen cuando termine el contador'
      },

      pricing: this.generatePersonalizedPricing(psychProfile)
    };

    return baseOffer;
  }

  private static getDiagnosisName(diagnosis: DiagnosisType): string {
    const names = {
      'financial-ceiling': 'Techo Invisible',
      'purpose-misalignment': 'Desalineación de Propósito',
      'generational-curse': 'Maldición Generacional',
      'divine-timing': 'Desincronización Divina',
      'spiritual-blockage': 'Bloqueo Espiritual'
    };
    return names[diagnosis];
  }

  private static generatePersonalizedTestimonials(divineCode: string, diagnosis: DiagnosisType) {
    const testimonialPool = [
      {
        name: "María González",
        code: divineCode,
        result: "En 7 días pagué una deuda de $15,000 que tenía hace años",
        days: "7 días",
        diagnosis: diagnosis
      },
      {
        name: "Carlos Mendoza", 
        code: divineCode,
        result: "Mi negocio se triplicó después de aplicar mi plan personalizado",
        days: "12 días",
        diagnosis: diagnosis
      },
      {
        name: "Ana Rodríguez",
        code: divineCode, 
        result: "Recibí una oferta laboral con 60% más de salario",
        days: "5 días",
        diagnosis: diagnosis
      }
    ];

    return testimonialPool;
  }

  private static generatePersonalizedPricing(psychProfile: any) {
    const basePricing = {
      basic: { price: 197, installments: 12 },
      complete: { price: 297, installments: 12 },
      premium: { price: 497, installments: 12 }
    };

    // Adjust pricing based on urgency and pain level
    if (psychProfile.urgencyLevel > 80) {
      // High urgency - add urgency discount
      basePricing.complete.price = 247;
      basePricing.premium.price = 397;
    }

    return basePricing;
  }
}