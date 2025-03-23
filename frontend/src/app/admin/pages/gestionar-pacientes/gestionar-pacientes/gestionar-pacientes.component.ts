import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { Paciente, UsuariosResponse } from '../../interface/paciente';
import Swal from 'sweetalert2';
import { BusquedasService } from '../../services/busquedas.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { Usuario } from '../../../../medicos/usuarios';

@Component({
  selector: 'app-gestionar-pacientes',
  templateUrl: './gestionar-pacientes.component.html',
  styleUrls: ['./gestionar-pacientes.component.scss']
})
export class GestionarPacientesComponent implements OnInit {
  
  pacientes: Paciente [] = [];
  public desde: number = 0;
  public totalUsuarios: number = 0;

  constructor(private PacienteService: PacienteService, private router: Router, private BusquedasService: BusquedasService, private AuthService: AuthService){}

  ngOnInit(){
    this.cargaPacientes();
  }


  cargaPacientes() {
    this.PacienteService.cargarPacientes(this.desde)
      .subscribe((response: UsuariosResponse) => { 
        this.totalUsuarios = response.total,
        this.pacientes = response.usuarios 

      });
  }

  borrarPaciente(paciente: Paciente) {
    if (this.AuthService.usuario.rut === paciente.rut) {
        Swal.fire('Operación no permitida', 'No puedes eliminarte a ti mismo.', 'error');
        return;
    }

    Swal.fire({
        title: `¿Estás seguro de querer eliminar a ${paciente.nombre}?`,
        text: "Esta acción eliminara todas las citas agendadas del paciente y sus historiales medicos.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) {
            this.PacienteService.borrarPaciente(paciente.rut).subscribe(
                (response) => {
                    Swal.fire('Eliminado!', response.msg, 'success');
                    this.cargaPacientes();
                },
                (error) => {
                    Swal.fire('Error', error.error.msg, 'error');
                }
            );
        }
    });
}

  
  

  cambiarRole(paciente: Paciente) {
    // Verificar si el paciente a editar es el mismo que el usuario autenticado
    if (this.AuthService.usuario.rut === paciente.rut) {
      Swal.fire(
        'Operación no permitida',
        'No puedes cambiar tu propio rol.',
        'error'
      );
      return; // Detener la ejecución si el usuario intenta cambiar su propio rol
    }
  
    // Si no es el mismo, proceder con la lógica de cambio de rol
    this.PacienteService.guardarUsuario(paciente)
      .subscribe(resp => {
        console.log(resp);
        Swal.fire(
          'Rol actualizado',
          `El rol de ${paciente.nombre} fue actualizado correctamente`,
          'success'
        );
      });
  }
  
  buscar(termino: string): void {
    console.log(termino);
    if (termino.length === 0) {
        this.cargaPacientes(); // Recargar todos los pacientes si la búsqueda está vacía
        return;
    }

    this.BusquedasService.buscar('usuarios', termino)
    .subscribe(resp => {
      console.log("Respuesta completa:", resp);
      this.pacientes = resp; // Asignar los resultados de la búsqueda
      console.log("this.pacientes después de asignar:", this.pacientes);
    });           
}

editarUsuario(usuario: any) {
  console.log('este paciente',usuario);
  this.router.navigate(['/editar-usuario', usuario.rut]);
}



cambiarPagina(nuevoOffset: number) {
      
      this.desde = nuevoOffset;

      if( this.desde < 0){
        this.desde = 0;
      } else if( this.desde >= this.totalUsuarios ){ 
        this.desde -= nuevoOffset;
      }
      this.cargaPacientes();

    }




}
