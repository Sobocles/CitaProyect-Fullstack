import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { phoneValidator } from 'src/app/shared/Validators/phone-validator';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {
  formulario: FormGroup;

  constructor(private formBuilder: FormBuilder, private PacienteService: PacienteService, private ActivatedRoute: ActivatedRoute, private router: Router) {
    this.formulario = this.formBuilder.group({
      rut: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fecha_nacimiento: [''],
      telefono: ['', [Validators.required, phoneValidator()]],
      direccion: [''],
    });
  }
  ngOnInit() {
    this.ActivatedRoute.params.subscribe(params => {
      const usuarioId = params['id'];
      console.log('id',usuarioId)
      if (usuarioId) {
        this.PacienteService.obtenerUsuarioPorId(usuarioId).subscribe((response: any) => {
          const usuarioData = response.usuario; 
          this.formulario.patchValue({
            rut: usuarioData.rut,
            nombre: usuarioData.nombre,
            apellidos: usuarioData.apellidos,
            email: usuarioData.email,
            fecha_nacimiento: usuarioData.fecha_nacimiento,
            telefono: usuarioData.telefono,
            direccion: usuarioData.direccion,  
          });
        });
      }

    });
  }

  editarPaciente() {
   
    Swal.fire({
      title: '¿Editar usuario?',
      text: 'Esta a punto de editar los datos del usuario. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, editar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
      
          console.log('AQUI',this.formulario.value);
          const usuarioEditado = this.formulario.value;
          console.log('AQUI ESTA EL USUARIO EDITADO',usuarioEditado);
          this.PacienteService.editarUsuario(usuarioEditado).subscribe(
            (response) => {
              Swal.fire('Éxito', 'Usuario editado exitosamente', 'success');
              this.router.navigateByUrl('/gestionar-pacientes');
            },
            (error) => {
              Swal.fire('Error', 'Hubo un error al editar el médico', 'error');
              // Manejar errores, como mensajes de error o reversiones de cambios en el formulario.
            }
          );
      
      }
    });
  }

}
