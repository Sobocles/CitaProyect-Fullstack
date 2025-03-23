import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { rutValidator } from 'src/app/shared/Validators/rut-validator';
import { phoneValidator } from 'src/app/shared/Validators/phone-validator';
import { passwordStrengthValidator } from 'src/app/shared/Validators/password-strength-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  miFormulario: FormGroup;

  constructor(private fb: FormBuilder, private AuthService: AuthService, private router: Router) {
    this.miFormulario = this.fb.group({
      rut: ['', [Validators.required, rutValidator()]],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), passwordStrengthValidator()]],
      fecha_nacimiento: ['', [Validators.required]],
      telefono: ['', [Validators.required, phoneValidator()]],
      direccion: ['', Validators.required]
    });
  }

  validarMayorDeEdad(edadMinima: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const valor = control.value;
      const hoy = new Date();
      const fechaNacimiento = new Date(valor);
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const m = hoy.getMonth() - fechaNacimiento.getMonth();
  
      if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }
  
      return edad >= edadMinima ? null : {'menorDeEdad': {value: control.value}};
    };
  }

 


  ngOnInit(): void {
  }


  registrar() {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      return;
    }
  
    const formData = this.miFormulario.value;
  
    this.AuthService.crearUsuario(formData).subscribe(
      (respuesta) => {
        Swal.fire({
          icon: 'success',
          title: '¡Registro completado!',
          text: 'Te has registrado exitosamente, ya puedes ingresar a tu cuenta.',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigateByUrl('/');
          }
        });
      },
      (err) => {
        if (err.error.msg === 'El correo ya está registrado') {
          Swal.fire('Error', 'El correo electrónico ya está en uso. Por favor, intenta con otro.', 'error');
        } else if (err.error.msg === 'El teléfono ya está registrado') {
          Swal.fire('Error', 'El número de teléfono ya está en uso. Por favor, intenta con otro.', 'error');
        } else {
          Swal.fire('Error', 'Ha ocurrido un error durante el registro. Por favor, inténtalo de nuevo.', 'error');
        }
      }
    );
  }
  
  
  

}
