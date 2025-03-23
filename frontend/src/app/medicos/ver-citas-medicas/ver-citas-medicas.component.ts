import { Component, OnInit } from '@angular/core';
import { CitaMedicaService } from '../../admin/pages/services/cita-medica.service';
import { AuthService } from '../../auth/services/auth.service';
import { BusquedaMedicoService } from '../../pacientes/services/busqueda-medico.service';
import { BusquedasService } from 'src/app/admin/pages/services/busquedas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-citas-medicas',
  templateUrl: './ver-citas-medicas.component.html',
  styleUrls: ['./ver-citas-medicas.component.scss']
})
export class VerCitasMedicasComponent implements OnInit {

  citasMedicas: any[] = []; 
  public desde: number = 0;
  public totalCitas: number = 0;

  constructor(private CitaMedicaService: CitaMedicaService, public authService: AuthService, private BusquedaMedicoService: BusquedasService){}

  ngOnInit() {
    if (this.authService.medico && this.authService.medico.rut) { 
        const rutMedico = this.authService.medico.rut;
        console.log('AQUI ESTA EL RUT DEL MEDICO', rutMedico );
        this.cargarCitasMedicas(rutMedico, 0);
    } else {
        console.error("RUT del usuario no definido o usuario no autenticado");
    }
}

cambioEstado(cita: any) {
  this.CitaMedicaService.actualizarCita(cita.idCita, { estado: cita.estado })
    .subscribe(response => {
      console.log('Cita actualizada:', response);
      Swal.fire({
        icon: 'success',
        title: '¡Hecho!',
        text: 'Cita actualizada correctamente.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });
    }, error => {
      console.error('Error al actualizar cita:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un error al actualizar la cita.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Intentar de nuevo'
      });
    });
}

cargarCitasMedicas(rutMedico: string, desde: number) {
  this.CitaMedicaService.obtenerCitaMedicaPorIdParaMedicos(rutMedico, desde)
  .subscribe((response: any) => {
    console.log('AQUI ESTA LAS CITAS',response);
    this.citasMedicas = response.citas;
  
    this.totalCitas = response.total;
    console.log('AQUI ESTA EL TOTAL DE CITAS',this.totalCitas);
    console.log('AQUI ESTA LAS CITAS EN EL ARREGLO',this.citasMedicas);
   

  }, error => {
    console.error("Error al obtener el historial médico:", error);
  });
}

buscar(termino: string) {
  console.log(termino);
  if (termino.length === 0) {
    this.cargarCitasMedicas(this.authService.medico.rut, this.desde);
    return;
  }

  
  this.BusquedaMedicoService.buscar('cita_medico', termino)
    .subscribe((response: any) => {
      console.log('aqui la respuesta',response)
      this.citasMedicas = response.citas;
      
    });
}

cambiarPagina(valor: number) {
  console.log("Valor actual de 'desde':", this.desde);
  this.desde += valor;

  if (this.desde < 0) {
    this.desde = 0;
  } else if (this.desde >= this.totalCitas) {
    this.desde -= valor;
  }

  console.log("Nuevo valor de 'desde':", this.desde);
  this.cargarCitasMedicas(this.authService.medico.rut, this.desde);
}

}
