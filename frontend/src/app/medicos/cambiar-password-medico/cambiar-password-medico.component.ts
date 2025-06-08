import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambiar-password-medico',
  templateUrl: './cambiar-password-medico.component.html',
  styleUrls: ['./cambiar-password-medico.component.scss']
})
export class CambiarPasswordMedicoComponent implements OnInit {
  public mostrarPassword: boolean = false;
  public mostrarNuevaPassword: boolean = false;
  public mostrarConfirmacionPassword: boolean = false;
  public miFormulario: FormGroup;
 
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.miFormulario = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPasswordConfirm: ['', Validators.required]
    }, {
      validators: this.passwordsIguales('newPassword', 'newPasswordConfirm')
    });
  }

  ngOnInit(): void {
    // Inicialización adicional si es necesaria
  }
  
  togglePasswordVisibility(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }
  
  passwordsIguales(campo1: string, campo2: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(campo1);
      const pass2Control = formGroup.get(campo2);
      
      if (pass1Control?.value === pass2Control?.value) {
        pass2Control?.setErrors(null);
      } else {
        pass2Control?.setErrors({ noIguales: true });
      }
    };
  }
  
  cambiarPassword(): void {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      return;
    }
    
    const { password, newPassword, newPasswordConfirm } = this.miFormulario.value;
 
    if (newPassword === newPasswordConfirm) {
      // Mostrar un loader mientras se procesa
      Swal.fire({
        title: 'Procesando',
        text: 'Actualizando contraseña...',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      this.authService.cambiarPasswordMedico(this.authService.medico.rut, password, newPassword)
        .subscribe({
          next: (ok) => {
            if (ok === true) {
              Swal.fire({
                title: 'Éxito',
                text: 'Ha actualizado correctamente la contraseña',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#1976d2'
              }).then(() => {
                this.miFormulario.reset();
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar la contraseña',
                icon: 'error',
                confirmButtonText: 'Intentar nuevamente',
                confirmButtonColor: '#1976d2'
              });
            }
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error en el servidor',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#1976d2'
            });
          }
        });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas nuevas no son iguales',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1976d2'
      });
    }
  }
}