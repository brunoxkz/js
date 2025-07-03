import { AdminQuestion, AdminQuestionOption } from '../types/admin';

export interface ValidationError {
  field: string;
  message: string;
}

export class QuestionValidator {
  static validateQuestion(question: Partial<AdminQuestion>): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required fields
    if (!question.question?.trim()) {
      errors.push({ field: 'question', message: 'La pregunta es requerida' });
    }

    if (!question.type) {
      errors.push({ field: 'type', message: 'El tipo de pregunta es requerido' });
    }

    if (!question.category?.trim()) {
      errors.push({ field: 'category', message: 'La categoría es requerida' });
    }

    // Question length validation
    if (question.question && question.question.length > 200) {
      errors.push({ field: 'question', message: 'La pregunta no puede exceder 200 caracteres' });
    }

    // Options validation
    if (!question.options || question.options.length < 2) {
      errors.push({ field: 'options', message: 'Debe tener al menos 2 opciones' });
    }

    if (question.options && question.options.length > 6) {
      errors.push({ field: 'options', message: 'No puede tener más de 6 opciones' });
    }

    // Validate each option
    if (question.options) {
      question.options.forEach((option, index) => {
        const optionErrors = this.validateOption(option, index);
        errors.push(...optionErrors);
      });
    }

    return errors;
  }

  static validateOption(option: Partial<AdminQuestionOption>, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const prefix = `options[${index}]`;

    if (!option.text?.trim()) {
      errors.push({ field: `${prefix}.text`, message: `Opción ${index + 1}: El texto es requerido` });
    }

    if (!option.value?.trim()) {
      errors.push({ field: `${prefix}.value`, message: `Opción ${index + 1}: El valor es requerido` });
    }

    if (option.weight === undefined || option.weight < 1 || option.weight > 5) {
      errors.push({ field: `${prefix}.weight`, message: `Opción ${index + 1}: El peso debe estar entre 1 y 5` });
    }

    if (option.text && option.text.length > 150) {
      errors.push({ field: `${prefix}.text`, message: `Opción ${index + 1}: El texto no puede exceder 150 caracteres` });
    }

    return errors;
  }

  static validateQuestionList(questions: AdminQuestion[]): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check for duplicate IDs
    const ids = questions.map(q => q.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      errors.push({ field: 'general', message: `IDs duplicados encontrados: ${duplicateIds.join(', ')}` });
    }

    // Check for duplicate values within options
    questions.forEach((question, qIndex) => {
      const values = question.options.map(opt => opt.value);
      const duplicateValues = values.filter((value, index) => values.indexOf(value) !== index);
      if (duplicateValues.length > 0) {
        errors.push({ 
          field: 'general', 
          message: `Pregunta ${qIndex + 1}: Valores de opción duplicados: ${duplicateValues.join(', ')}` 
        });
      }
    });

    // Check block distribution
    const typeCount = questions.reduce((acc, q) => {
      acc[q.type] = (acc[q.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if (typeCount.positive < 1) {
      errors.push({ field: 'general', message: 'Debe haber al menos 1 pregunta positiva' });
    }
    if (typeCount.neutral < 1) {
      errors.push({ field: 'general', message: 'Debe haber al menos 1 pregunta neutral' });
    }
    if (typeCount.negative < 1) {
      errors.push({ field: 'general', message: 'Debe haber al menos 1 pregunta negativa' });
    }

    return errors;
  }

  static sanitizeQuestion(question: Partial<AdminQuestion>): Partial<AdminQuestion> {
    return {
      ...question,
      question: question.question?.trim(),
      category: question.category?.trim(),
      options: question.options?.map(opt => ({
        ...opt,
        text: opt.text?.trim(),
        value: opt.value?.trim().toLowerCase().replace(/\s+/g, '-')
      }))
    };
  }
}