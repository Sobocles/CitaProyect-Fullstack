import { Component, OnInit } from '@angular/core';
// Importa otras clases si es necesario

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  

  miFormulario: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]], // Cambia 'username' a 'email'
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {

  }

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }
//gestionar-pacientes
login() {
  const { email, password } = this.miFormulario.value;

  this.authService.login(email, password).subscribe(
    resp => {
      console.log(resp);
      // Aquí se maneja la lógica de redirección según el rol del usuario
      if (resp.userOrMedico.rol === 'ADMIN_ROLE') {
        this.router.navigateByUrl('/inicio-instrucciones');
      } else if (resp.userOrMedico.rol === 'USER_ROLE') {
        this.router.navigateByUrl('/inicio-paciente');
      } else if (resp.userOrMedico.rol === 'MEDICO_ROLE') {
        this.router.navigateByUrl('/agregar-historial');
      } else {
        console.error('Rol de usuario no reconocido');
       
      }
    },
    error => {
      // Manejo de errores de autenticación
      console.error('Error en el login:', error);
      let mensaje = 'Error en la autenticación';

      // Personaliza este mensaje según la respuesta del backend
      if (error.status === 400) {
        mensaje = 'Contraseña incorrecta';
      } else if (error.status === 404) {
        mensaje = 'Correo no encontrado';
      } else if (error.status === 500) {
        mensaje = 'Problema del servidor, intente más tarde';
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje
      });
    }
  );
}


  
}
