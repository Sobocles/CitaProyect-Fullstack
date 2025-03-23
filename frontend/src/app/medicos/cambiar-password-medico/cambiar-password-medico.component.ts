import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambiar-password-medico',
  templateUrl: './cambiar-password-medico.component.html',
  styleUrls: ['./cambiar-password-medico.component.scss']
})
export class CambiarPasswordMedicoComponent {
  public mostrarPassword: boolean = false;
  public mostrarNuevaPassword: boolean = false;
  public mostrarConfirmacionPassword: boolean = false;
  miFormulario: FormGroup;
  
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.miFormulario = this.fb.group({
      // Los campos del formulario y sus validaciones
      password: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPasswordConfirm: ['', Validators.required]
    }, {
    
    });
  }


  togglePasswordVisibility() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  cambiarPassword(){
    const { password, newPassword, newPasswordConfirm } = this.miFormulario.value;
  
    if(newPassword === newPasswordConfirm){
      this.authService.cambiarPasswordMedico(this.authService.medico.rut, password, newPassword).subscribe(ok=>{
        if(ok === true){
          Swal.fire('Ha actualizado correctamente la contraseña', '', 'success')
            .then(() => {
              // Limpia el formulario solo si el cambio de contraseña fue exitoso y el usuario cierra el SweetAlert
              this.miFormulario.reset();
            });
        } else {
          Swal.fire('Error', '', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'Las contraseñas nuevas no son iguales', 'error');
    }
  }
  
}
