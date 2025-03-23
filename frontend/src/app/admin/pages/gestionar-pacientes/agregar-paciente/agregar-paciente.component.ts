import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors  } from '@angular/forms';
import { PacienteService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { rutValidator } from 'src/app/shared/Validators/rut-validator';
import { passwordStrengthValidator } from 'src/app/shared/Validators/password-strength-validator';
import { phoneValidator } from 'src/app/shared/Validators/phone-validator';

@Component({
  selector: 'app-agregar-paciente',
  templateUrl: './agregar-paciente.component.html',
  styleUrls: ['./agregar-paciente.component.scss']
})
export class AgregarPacienteComponent {

  formulario: FormGroup;

  constructor(private formBuilder: FormBuilder, private PacienteService: PacienteService, private router: Router) {
    this.formulario = this.formBuilder.group({
      rut: ['', [Validators.required, rutValidator()]],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      password: ['', [Validators.required, passwordStrengthValidator()]],
      email: ['', [Validators.required, Validators.email, this.gmailValidator]],
      fecha_nacimiento: ['', Validators.required],
      telefono: ['', [Validators.required, phoneValidator()]],
      direccion: ['', Validators.required],
    });
  }



  gmailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
  
    const isGmail = value.endsWith('@gmail.com');
    return !isGmail ? { 'notGmail': true } : null;
  }


  crearPaciente() {
    if (this.formulario.invalid) {
      // Marca todos los controles del formulario como tocados
      this.formulario.markAllAsTouched();
      return;
    }
  
    const formData = this.formulario.value;
    console.log(formData);
  
    this.PacienteService.crearPaciente(formData).subscribe(
      (respuesta: any) => {
        // Mensaje de éxito con SweetAlert
        Swal.fire({
          title: '¡Éxito!',
          text: 'El paciente ha sido creado con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          // Redireccionar a la ruta 'gestionar-pacientes' después de cerrar el SweetAlert
          if (result.isConfirmed) {
            this.router.navigate(['/gestionar-pacientes']);
          }
        });
  
      }, (err) => {
        // Mensaje de error con SweetAlert
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }
  
  

}
