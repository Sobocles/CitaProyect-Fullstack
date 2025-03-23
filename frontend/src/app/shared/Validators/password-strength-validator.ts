// src/app/shared/validators/password-strength-validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const hasUpperCase = /[A-Z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const hasSpecialChar = /[.,'!@#$%^&*()_+-]+/.test(value);
    const passwordValid = hasUpperCase && hasNumeric && hasSpecialChar;
    return !passwordValid ? { passwordStrength: true } : null;
  };
}
