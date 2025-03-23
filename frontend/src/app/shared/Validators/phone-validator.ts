// src/app/shared/validators/phone-validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const telefonoRegex = /^\+56 9 \d{4}-\d{4}$/;
    return telefonoRegex.test(value) ? null : { telefonoInvalido: true };
  };
}
