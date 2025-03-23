import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HorarioMedicoService } from '../../services/horario-medico.service';
import { HorarioMedico, HorarioResponse } from '../../interface/horarioMedico';
import Swal from 'sweetalert2';
import { BusquedasService } from '../../services/busquedas.service';


@Component({
  selector: 'app-gestionar-horarios-medicos',
  templateUrl: './gestionar-horarios-medicos.component.html',
  styleUrls: ['./gestionar-horarios-medicos.component.scss']
})
export class GestionarHorariosMedicosComponent implements OnInit {

  public totalHorarios: number = 0;

  public horarios: HorarioMedico[] = [];

  public desde: number = 0;


  constructor(private HorarioMedicoService: HorarioMedicoService, private router: Router, private BusquedasService: BusquedasService){}

  ngOnInit(): void {
    this.cargaHorario()
  }

  borrarHorario( horario: HorarioMedico ) {

    Swal.fire({
      title: '¿Borrar Horario?',
      text: `Esta seguro que desea eliminar este horario?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {
        
        this.HorarioMedicoService.borrarHorario( horario.idHorario )
          .subscribe( resp => {
            
            this.cargaHorario();
            Swal.fire(
              'Horario borradoa',
              `Horario medico numero ${ horario.idHorario } fue eliminado correctamente`,
              'success'
            );
            
          });

      }
    })

  }

  redirigirACrearCita() {
    this.router.navigateByUrl('/agregar-cita');
  }

  cargaHorario() {
    this.HorarioMedicoService.cargarHorario(this.desde)
      .subscribe((response: HorarioResponse) => {
        this.totalHorarios = response.total;
        this.horarios = response.horarios;

      });
  }

  editarHorario(horario: HorarioMedico) {
 
    this.router.navigate(['/editar-horario', horario.idHorario]);
  }

  buscar(termino: string): void {
    if (termino.length === 0) {
      this.cargaHorario(); // Recargar todos los horarios si la búsqueda está vacía
      return;
    }
  
    this.BusquedasService.buscar('horario_medico', termino)
      .subscribe((resp: HorarioMedico[]) => {
        this.horarios = resp; // Asignar los resultados de la búsqueda
        console.log(this.horarios);
    });  
  }
  

  cambiarPagina(nuevoOffset: number) {
  this.desde = nuevoOffset;

  if( this.desde < 0){
    this.desde = 0;
  } else if( this.desde >= this.totalHorarios ){ 
    this.desde -= nuevoOffset;
  }
  this.cargaHorario();

}


}
