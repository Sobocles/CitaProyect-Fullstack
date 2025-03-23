import { Component, OnInit } from '@angular/core';
import { BusquedaMedicoService } from '../../services/busqueda-medico.service';
import { Bloque, BloquesResponse } from '../interfaces/busqueda-medicos';
import { CitaMedicaService } from '../../../admin/pages/services/cita-medica.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-busqueda-medico',
  templateUrl: './busqueda-medico.component.html',
  styleUrls: ['./busqueda-medico.component.scss']
})
export class BusquedaMedicoComponent implements OnInit {

  bloques: Bloque[] = [];

  constructor(private BusquedaMedicoService: BusquedaMedicoService, private CitaMedicaService: CitaMedicaService, private AuthService: AuthService, private router: Router) { }
  
  ngOnInit(): void {
    this.BusquedaMedicoService.bloques$
      .subscribe(data => {
        this.bloques = data;
        console.log(this.bloques);
      });
      const rutPaciente = this.AuthService.usuario.rut;
      console.log('Aqui esta el rut del paciente logeado',rutPaciente);
  }

  volverAlFormulario(): void {
    this.router.navigate(['/formulario-cita']);
}




agendarCita(bloque: Bloque): void {
  const rutPaciente = this.AuthService.usuario.rut!;

  // Primero creamos la cita médica
  this.CitaMedicaService.crearCitaMedicaPaciente(bloque, rutPaciente)
    .subscribe(
      (response) => {
        console.log('Cita creada con éxito', response);
        console.log('AQUI ESTA EL ID CREADO', response.cita.idCita);

        // Una vez que la cita está creada, procedemos con el pago
        console.log('Precio de la cita:', bloque.precio);
        this.BusquedaMedicoService.pagarCita(bloque.precio, bloque.especialidad, response.cita.idCita)
          .subscribe(
            responsePago => {
              console.log('Aquí está la respuesta del pago', responsePago);
              // Aquí manejas la redirección o lo que sea necesario después del pago
              window.location.href = responsePago.init_point;
            },
            errorPago => {
              console.error('Error al crear la orden de pago:', errorPago);
            }
          );
      },
      (error) => {
        console.error('Error al crear la cita médica:', error);

        // Verificar si el error es específicamente porque el usuario ya tiene una cita programada
        if (error.status === 400 && error.error.mensaje) {
          Swal.fire({
            title: 'Error',
            text: error.error.mensaje, // Muestra el mensaje enviado desde el backend
            icon: 'error',
            confirmButtonText: 'Entendido'
          });
        } else {
          // Manejo de otros tipos de errores
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al agendar la cita.',
            icon: 'error',
            confirmButtonText: 'Entendido'
          });
        }
      }
    );
}
  
  

}
