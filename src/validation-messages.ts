import { ValidationError } from 'class-validator';

export const portugueseMessages: Record<string, string> = {
  isString: 'O campo $property deve ser uma string',
  isEmail: 'O campo $property deve ser um email válido',
  isEnum: 'O campo $property deve ser um dos valores: $constraint1',
  isNotEmpty: 'O campo $property não pode estar vazio',
  minLength: 'O campo $property deve ter pelo menos $constraint1 caracteres',
  maxLength: 'O campo $property deve ter no máximo $constraint1 caracteres',
  whitelistValidation: 'A propriedade $property não é permitida',
  isUUID: 'O campo $property deve ser um UUID válido',
  isInt: 'O campo $property deve ser um número inteiro',
  isArray: 'O campo $property deve ser um array',
};

function formatMessage(
  template: string,
  property: string,
  constraints: any[] = [],
): string {
  return template
    .replace('$property', property)
    .replace('$constraint1', constraints[0] ?? '')
    .replace('$constraint2', constraints[1] ?? '')
    .replace('$constraint3', constraints[2] ?? '');
}

function extractMessages(error: ValidationError): string[] {
  if (error.constraints) {
    return Object.entries(error.constraints).map(([key, value]) => {
      const template = portugueseMessages[key] || value;
      const constraints = error.contexts?.[key]?.constraints || [];
      return formatMessage(template, error.property, constraints);
    });
  }

  if (error.children && error.children.length > 0) {
    return error.children.flatMap((child) => extractMessages(child));
  }

  return [];
}

export function translateValidationErrors(errors: ValidationError[]): string[] {
  return errors.flatMap(extractMessages);
}
