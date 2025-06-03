import { Component, OnInit } from '@angular/core';
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
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Inicialización si es necesaria
  }

  login() {
    console.log('📝 Iniciando proceso de login en componente');
    if (this.miFormulario.invalid) {
      console.log('📝 Formulario inválido, marcando como touched');
      this.miFormulario.markAllAsTouched();
      return;
    }
    
    const { email, password } = this.miFormulario.value;
    console.log('📝 Intentando login con email:', email);
    
    this.authService.login(email, password).subscribe(
      (resp: any) => {
        console.log('📝 Respuesta de login recibida:', resp);
        
        // Verificar si existe userOrMedico en la respuesta
        if (!resp.userOrMedico) {
          console.error('📝 Error: userOrMedico no está definido en la respuesta');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Formato de respuesta incorrecto. Contacte al administrador.'
          });
          return;
        }
        
        // Obtener el rol del usuario (intentar de ambas ubicaciones)
        const rol = resp.userOrMedico.rol || resp.rol;
        
        console.log('📝 Rol del usuario obtenido:', rol);
        console.log('📝 Tipo de dato del rol:', typeof rol);
        
        switch (rol) {
          case 'ADMIN_ROLE':
            console.log('📝 Redireccionando a admin');
            this.router.navigateByUrl('/inicio-instrucciones');
            break;
          case 'USER_ROLE':
            console.log('📝 Redireccionando a usuario');
            this.router.navigateByUrl('/inicio-paciente');
            break;
          case 'MEDICO_ROLE':
            console.log('📝 Redireccionando a médico');
            this.router.navigateByUrl('/agregar-historial');
            break;
          default:
            console.error('📝 Rol no reconocido:', rol);
            Swal.fire({
              icon: 'warning',
              title: 'Advertencia',
              text: 'Rol de usuario no reconocido'
            });
        }
      },
      error => {
        console.error('📝 Error en login:', error);
        // Resto del código de manejo de errores
      }
    );
  }
}