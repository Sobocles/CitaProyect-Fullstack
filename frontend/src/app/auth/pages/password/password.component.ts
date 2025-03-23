import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent {
  

  recoveryForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.recoveryForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
  }

  recuperarPassword(){
    console.log(this.recoveryForm.value);
    const {email, nombre} = this.recoveryForm.value;
    console.log(email);
    this.authService.recuperarPassword(nombre, email).subscribe(ok =>{
      if(ok === true) {
        console.log(ok);
        Swal.fire('Recuperación de Contraseña', `Se ha enviado un correo a la dirección ${email} `, 'success');
      } else {
        Swal.fire('Error', ok, 'error');
      }
    });
  }
}
