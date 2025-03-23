import { Component, OnInit } from '@angular/core';



import { BusquedasService } from 'src/app/admin/pages/services/busquedas.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CitaMedicaService } from '../../../admin/pages/services/cita-medica.service';
@Component({
  selector: 'app-ver-citas-paciente',
  templateUrl: './ver-citas-paciente.component.html',
  styleUrls: ['./ver-citas-paciente.component.scss']
})
export class VerCitasPacienteComponent implements OnInit {

  citasMedicas: any[] = []; 
  public desde: number = 0;
  public totalCitas: number = 0;
    constructor( public authService: AuthService, private BusquedaMedicoService: BusquedasService, private CitaMedicaService: CitaMedicaService){}

  ngOnInit() {
    if (this.authService.usuario && this.authService.usuario.rut) { 
        const rutUsuario = this.authService.usuario.rut;
        console.log('AQUI ESTA EL RUT DEL U', rutUsuario );
        this.cargarCitasMedicas(rutUsuario, 0);
    } else {
        console.error("RUT del usuario no definido o usuario no autenticado");
    }
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
  this.cargarCitasMedicas(this.authService.usuario.rut!, this.desde);
}

cargarCitasMedicas(rutPaciente: string, desde: number) {
  this.CitaMedicaService.obtenerCitaMedicaPorIdParaPacientes(rutPaciente, desde)
  .subscribe((response: any) => {
 
    this.citasMedicas = response.citas;
  
    this.totalCitas = response.total;
    console.log('AQUI ESTA EL TOTAL DE CITAS',this.totalCitas);
    console.log('AQUI ESTA LAS CITAS EN EL ARREGLO',this.citasMedicas);
   

  }, error => {
    console.error("Error al obtener el historial médico:", error);
  });
}

  buscar(termino: string){}

}
