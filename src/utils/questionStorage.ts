import { AdminQuestion } from '../types/admin';
import { QuizQuestion } from '../types';

const STORAGE_KEY = 'divine_quiz_questions';
const BACKUP_KEY = 'divine_quiz_questions_backup';

export class QuestionStorage {
  static save(questions: AdminQuestion[]): void {
    try {
      // Create backup before saving
      const current = localStorage.getItem(STORAGE_KEY);
      if (current) {
        localStorage.setItem(BACKUP_KEY, current);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    } catch (error) {
      console.error('Error saving questions:', error);
      throw new Error('Failed to save questions');
    }
  }

  static load(): AdminQuestion[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return this.getDefaultQuestions();
    } catch (error) {
      console.error('Error loading questions:', error);
      return this.getDefaultQuestions();
    }
  }

  static backup(): AdminQuestion[] | null {
    try {
      const backup = localStorage.getItem(BACKUP_KEY);
      return backup ? JSON.parse(backup) : null;
    } catch (error) {
      console.error('Error loading backup:', error);
      return null;
    }
  }

  static restore(): boolean {
    try {
      const backup = this.backup();
      if (backup) {
        this.save(backup);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error restoring backup:', error);
      return false;
    }
  }

  static export(): string {
    const questions = this.load();
    const exportData = {
      questions,
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0',
        totalQuestions: questions.length
      }
    };
    return JSON.stringify(exportData, null, 2);
  }

  static import(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.questions && Array.isArray(data.questions)) {
        this.save(data.questions);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing questions:', error);
      return false;
    }
  }

  static convertToQuizFormat(adminQuestions: AdminQuestion[]): QuizQuestion[] {
    return adminQuestions
      .filter(q => q.isActive)
      .sort((a, b) => a.order - b.order)
      .map(q => ({
        id: q.id,
        type: q.type,
        category: q.category,
        question: q.question,
        options: q.options.map(opt => ({
          id: opt.id,
          text: opt.text,
          value: opt.value,
          weight: opt.weight
        }))
      }));
  }

  private static getDefaultQuestions(): AdminQuestion[] {
    const defaultQuestions = [
      {
        id: 'desire-main',
        type: 'positive' as const,
        category: 'desire',
        question: '¿Qué aspecto de la abundancia divina anhelas experimentar con más urgencia?',
        options: [
          {
            id: 'service',
            text: 'Servir a Dios con total libertad financiera',
            value: 'divine-service',
            weight: 4
          },
          {
            id: 'family',
            text: 'Asegurar el futuro de mi familia y dejar un legado',
            value: 'family-legacy',
            weight: 3
          },
          {
            id: 'blessing',
            text: 'Ser canal de bendiciones para otros necesitados',
            value: 'blessing-channel',
            weight: 4
          },
          {
            id: 'ministry',
            text: 'Desarrollar el ministerio/negocio que Dios puso en mi corazón',
            value: 'divine-purpose',
            weight: 5
          }
        ],
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'future-vision',
        type: 'positive' as const,
        category: 'vision',
        question: 'Si el techo invisible sobre tu prosperidad se rompiera completamente, ¿qué sería lo primero que harías?',
        options: [
          {
            id: 'ministry-time',
            text: 'Dedicaría más tiempo a servir en el ministerio que amo',
            value: 'ministry-focus',
            weight: 4
          },
          {
            id: 'debts',
            text: 'Saldaría todas mis deudas y aseguraría el futuro de mi familia',
            value: 'financial-freedom',
            weight: 3
          },
          {
            id: 'help-others',
            text: 'Bendeciría a otros que están pasando necesidad',
            value: 'generosity',
            weight: 4
          },
          {
            id: 'divine-project',
            text: 'Iniciaría el proyecto divino que he postergado por años',
            value: 'divine-timing',
            weight: 5
          }
        ],
        order: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'divine-purpose',
        type: 'positive' as const,
        category: 'purpose',
        question: '¿Cuál crees que es tu propósito divino en el área financiera?',
        options: [
          {
            id: 'example',
            text: 'Ser un ejemplo de la prosperidad bíblica para otros',
            value: 'example-prosperity',
            weight: 4
          },
          {
            id: 'kingdom',
            text: 'Financiar la expansión del Reino de Dios',
            value: 'kingdom-expansion',
            weight: 5
          },
          {
            id: 'generational',
            text: 'Romper maldiciones generacionales en mi familia',
            value: 'generational-breakthrough',
            weight: 3
          },
          {
            id: 'integrity',
            text: 'Mostrar que se puede prosperar con integridad cristiana',
            value: 'christian-integrity',
            weight: 4
          }
        ],
        order: 3,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'current-situation',
        type: 'neutral' as const,
        category: 'current',
        question: '¿Cómo describirías tu relación actual con las finanzas?',
        options: [
          {
            id: 'pray-effort',
            text: 'Oro y me esfuerzo, pero los resultados no llegan como espero',
            value: 'prayer-without-results',
            weight: 3
          },
          {
            id: 'basic-struggle',
            text: 'Estoy luchando para cubrir lo básico mes a mes',
            value: 'basic-needs',
            weight: 2
          },
          {
            id: 'intuitive',
            text: 'Tomo decisiones intuitivas, sin mucha estrategia',
            value: 'no-strategy',
            weight: 3
          },
          {
            id: 'knowledge-gap',
            text: 'Conozco principios bíblicos, pero me cuesta aplicarlos',
            value: 'application-gap',
            weight: 4
          }
        ],
        order: 4,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'financial-history',
        type: 'neutral' as const,
        category: 'pattern',
        question: '¿Qué patrón has observado en tu historia financiera?',
        options: [
          {
            id: 'ups-downs',
            text: 'Momentos de avance seguidos de retrocesos inesperados',
            value: 'roller-coaster',
            weight: 4
          },
          {
            id: 'missed-opportunities',
            text: 'Oportunidades que aparecen pero que no logro aprovechar',
            value: 'missed-timing',
            weight: 3
          },
          {
            id: 'ceiling',
            text: 'Un "techo" que parece limitar mi crecimiento sin importar lo que haga',
            value: 'invisible-ceiling',
            weight: 5
          },
          {
            id: 'cycles',
            text: 'Ciclos repetitivos de escasez a pesar de mis esfuerzos',
            value: 'scarcity-cycles',
            weight: 4
          }
        ],
        order: 5,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'main-blockage',
        type: 'negative' as const,
        category: 'blockage',
        question: '¿Cuál de estas frases describe mejor lo que sientes que te está bloqueando?',
        options: [
          {
            id: 'ceiling-prayer',
            text: 'Oro y me esfuerzo mucho, pero parece que hay un techo que no puedo romper',
            value: 'prayer-ceiling',
            weight: 5
          },
          {
            id: 'self-sabotage',
            text: 'Hay algo en mí que sabotea mi propio éxito y no sé qué es',
            value: 'internal-sabotage',
            weight: 4
          },
          {
            id: 'setbacks',
            text: 'Logro avanzar, pero siempre surge algo que me hace retroceder',
            value: 'constant-setbacks',
            weight: 4
          },
          {
            id: 'confusion',
            text: 'Ya no sé qué hacer para cambiar mi situación',
            value: 'lost-hope',
            weight: 3
          }
        ],
        order: 6,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'emotional-impact',
        type: 'negative' as const,
        category: 'emotion',
        question: '¿Cómo te afecta emocionalmente esta situación financiera?',
        options: [
          {
            id: 'shame',
            text: 'Me da vergüenza mi situación actual a esta edad',
            value: 'financial-shame',
            weight: 4
          },
          {
            id: 'stress',
            text: 'Siento estrés constante que afecta mi sueño y mi salud',
            value: 'chronic-stress',
            weight: 3
          },
          {
            id: 'guilt',
            text: 'Me genera culpa no poder ayudar a los que amo como quisiera',
            value: 'provider-guilt',
            weight: 4
          },
          {
            id: 'doubt',
            text: 'Cuestiono si realmente estoy en el centro de la voluntad de Dios',
            value: 'spiritual-doubt',
            weight: 5
          }
        ],
        order: 7,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'future-consequences',
        type: 'negative' as const,
        category: 'consequence',
        question: 'Si nada cambia en los próximos 12 meses, ¿cuál sería la consecuencia más dolorosa?',
        options: [
          {
            id: 'unfulfilled',
            text: 'Llegar al final de mi vida sin haber cumplido mi propósito',
            value: 'unfulfilled-purpose',
            weight: 5
          },
          {
            id: 'family-provision',
            text: 'No poder proveer adecuadamente para mi familia',
            value: 'family-failure',
            weight: 4
          },
          {
            id: 'missed-divine',
            text: 'Perder oportunidades divinas por falta de recursos',
            value: 'divine-opportunities',
            weight: 4
          },
          {
            id: 'frustration',
            text: 'Seguir sintiendo esta frustración y vergüenza constantes',
            value: 'chronic-frustration',
            weight: 3
          }
        ],
        order: 8,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Save default questions to localStorage
    this.save(defaultQuestions);
    return defaultQuestions;
  }
}