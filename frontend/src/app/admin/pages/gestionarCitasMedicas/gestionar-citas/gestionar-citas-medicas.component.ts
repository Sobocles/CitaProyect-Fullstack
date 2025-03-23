import { Component, OnInit } from '@angular/core';
import { BusquedasService } from '../../services/busquedas.service';
import { CitaMedica, CitasResponse } from '../../interface/cita_medica';
import { CitaMedicaService } from '../../services/cita-medica.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-gestionar-citas-medicas',
  templateUrl: './gestionar-citas-medicas.component.html',
  styleUrls: ['./gestionar-citas-medicas.component.scss']
})
export class GestionarCitasMedicasComponent implements OnInit {

  public citas: CitaMedica[] = [];
  public desde: number = 0;
 
  public mostrarEspecialidad: boolean = false;
  public totalCitas: number = 0;


  // Agrega una función para cambiar el filtro


    constructor(private BusquedasService: BusquedasService, private CitaMedicaService: CitaMedicaService){}

    ngOnInit(): void {
      this.cargarCitas();
    }
  
    buscar(termino: string): void {
      if (termino.length === 0) {
        this.cargarCitas(); // Recargar todas las citas si la búsqueda está vacía
        return;
      }
    
      this.BusquedasService.buscar('cita_medica', termino)
        .subscribe((resp: any) => {
          this.citas = resp.citas; 
          console.log(this.citas);
        });  
    }
    

borrarCita( cita: any ) {

  Swal.fire({
    title: '¿Borrar Horario?',
    text: `Esta seguro que desea eliminar esta cita?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Si, borrarlo'
  }).then((result) => {
    if (result.value) {
      
      this.CitaMedicaService.borrarCitaMedica( cita.idCita )
        .subscribe( resp => {
          
          this.cargarCitas()
          Swal.fire(
            'Horario borrado',
            `Horario ${ cita.idCita } fue eliminado correctamente`,
            'success'
          );
          
        });

    }
  })

}

cargarCitas() {
  this.CitaMedicaService.cargarCitaMedica(this.desde)
    .subscribe((response: CitasResponse) => { 
      this.totalCitas = response.total ?? this.citas.length; 
      this.citas = response.citas; 
     

    });
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

cambiarPagina(nuevoOffset: number) {
  this.desde = nuevoOffset;
  console.log(this.totalCitas);
  if( this.desde < 0){ 
    this.desde = 0;
  } else if( this.desde >= this.totalCitas ){ 
    this.desde -= nuevoOffset;
  }
  this.cargarCitas(); 
}

}
