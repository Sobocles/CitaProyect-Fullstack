import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario';
@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.scss']
})
export class CambiarPasswordComponent implements OnInit {
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
  ngOnInit(): void {
  
  }

  togglePasswordVisibility() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  cambiarPassword(){
    const {password, newPassword, newPasswordConfirm} = this.miFormulario.value;
 
    if(newPassword === newPasswordConfirm){
      this.authService.cambiarPassword(this.authService.usuario.rut!, password, newPassword).subscribe(ok=>{
        if(ok === true){
          Swal.fire('Ha actualizado correctamente la contraseña', '', 'success');
        } else {
          Swal.fire('Error', '', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'Las contraseñas nuevas no son iguales ', 'error');
    }
  }

}
