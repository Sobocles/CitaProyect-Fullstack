// src/app/shared/validators/rut-validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function rutValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;
    if (!value) {
   
      return null;
    }

    // Remover puntos y guiones
    const cleanValue = value.replace(/[.-]/g, '');
    if (cleanValue.length < 2) {
      return { rutInvalid: true };
    }
    
    const body = cleanValue.slice(0, -1);
    const dv = cleanValue.slice(-1).toUpperCase();

    // Verificar que el cuerpo sea numérico
    if (!/^\d+$/.test(body)) {
      return { rutInvalid: true };
    }

    let sum = 0;
    let multiplier = 2;

    // Calcular el dígito verificador
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body.charAt(i), 10) * multiplier;
      multiplier = multiplier < 7 ? multiplier + 1 : 2;
    }
    const dvCalculated = 11 - (sum % 11);
    const dvExpected =
      dvCalculated === 11 ? '0' :
      dvCalculated === 10 ? 'K' : dvCalculated.toString();

    return dvExpected === dv ? null : { rutInvalid: true };
  };
}
