import { Component } from '@angular/core';
import { Historial, HistorialResponse } from '../historial';
import { HistorialService } from '../services/historial.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BusquedasService } from '../../admin/pages/services/busquedas.service';

@Component({
  selector: 'app-gestionar-historiales',
  templateUrl: './gestionar-historiales.component.html',
  styleUrls: ['./gestionar-historiales.component.scss']
})
export class GestionarHistorialesComponent {
  
  public historiales: any[] = [];
  historialMedico: Historial[] = []; 
  public desde: number = 0;
  public totalHistoriales: number = 0;

  constructor(private HistorialService: HistorialService, private authservice: AuthService, private router: Router, private BusquedasService: BusquedasService){}

  ngOnInit() {
    if (this.authservice.medico && this.authservice.medico.rut) { 
        const rutMedico = this.authservice.medico.rut;
        this.cargarHistorialMedico(rutMedico);
    } else {
        console.error("RUT del medico no definido o medico no autenticado");
    }
}

buscar(termino: string): void {
  console.log(termino);
  if (termino.length === 0) {
      this.cargarHistorialMedico(this.authservice.medico.rut); // Recargar todos los pacientes si la búsqueda está vacía
      return;
  }

  this.BusquedasService.buscar('historiales', termino)
  .subscribe(resp => {
    
    this.historiales = resp.citas; // Asignar los resultados de la búsqueda
    
  });           
}

cambiarPagina( valor: number ) { 
  this.desde +=valor;

  if( this.desde < 0){ 
    this.desde = 0;
  } else if( this.desde >= this.totalHistoriales ){ 
    this.desde -= valor;
  }
  this.cargarHistorialMedico(this.authservice.medico.rut);
}

cargarHistorialMedico(rut: string): void {
    this.HistorialService.obtenerHistorialPorIdMedico(rut, this.desde).subscribe(
      (resp: any) => {
      
        this.historiales = resp.historiales;
        console.log('aqui el arreglo de historiales',this.historiales);
        this.totalHistoriales = resp.total;
 
      },
      (err) => {
        console.error('Error al cargar historiales:', err);
      }
    );
  }

  editarHistorial(historial: any) {
    console.log('este historial',historial);
    this.router.navigate(['/editar-historial', historial.id_historial]);
  }

  borrarHistorial( historial: any ) {

    Swal.fire({
      title: '¿Borrar Historial?',
      text: `Esta a punto de borrar el historial numero ${ historial.id_historial }, ¿Esta seguro que desea borrarlo?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {
        
        this.HistorialService.borrarHistorial( historial.id_historial )
          .subscribe( resp => {
            
            this.cargarHistorialMedico(this.authservice.medico.rut);
            Swal.fire(
              'Historial borrado',
              `El historial ${ historial.id_historial } fue eliminado correctamente`,
              'success'
            );
            
          });

      }
    })

  }
}
