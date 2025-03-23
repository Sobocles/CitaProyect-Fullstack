import { Component, OnDestroy, OnInit } from '@angular/core';
import { HistorialService } from 'src/app/medicos/services/historial.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Historial, HistorialResponse } from 'src/app/medicos/historial';
import { Usuario } from 'src/app/models/usuario';
import { BusquedaMedicoService } from '../../../services/busqueda-medico.service';
import { BusquedasService } from '../../../../admin/pages/services/busquedas.service';
@Component({
  selector: 'app-historial-paciente',
  templateUrl: './historial-paciente.component.html',
  styleUrls: ['./historial-paciente.component.scss']
})
export class HistorialPacienteComponent implements OnInit {

  historialMedico: Historial[] = []; 
  public desde: number = 0;
  public totalHistoriales: number = 0;

  constructor(private historialService: HistorialService, private authservice: AuthService, private BusquedasService: BusquedasService){}

  ngOnInit() {
    if (this.authservice.usuario && this.authservice.usuario.rut) { 
        const rutUsuario = this.authservice.usuario.rut;
        this.cargarHistorialMedico(rutUsuario);
    } else {
        console.error("RUT del usuario no definido o usuario no autenticado");
    }
}




  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
        this.desde = 0;
    } else if (this.desde >= this.totalHistoriales) {
        this.desde -= valor;
    }

    const rutUsuario = this.authservice.usuario?.rut;
    if (rutUsuario) {
        this.cargarHistorialMedico(rutUsuario);
    } else {
        console.error("RUT del usuario no definido o usuario no autenticado");
    }
}


  cargarHistorialMedico(rut: string) {
    this.historialService.obtenerHistorialPorId(rut, this.desde)
    .subscribe((historial: HistorialResponse) => {
     
      
      this.historialMedico = historial.historiales;
      console.log('AQUI ESTA EL ARREGLO DE HISTORIALES',this.historialMedico );
      this.totalHistoriales = historial.total; 
    }, error => {
      console.error("Error al obtener el historial médico:", error);
    });
}


}
