import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistorialService } from '../../../../medicos/services/historial.service';

@Component({
  selector: 'app-ver-historial-medico-paciente',
  templateUrl: './ver-historial-medico-paciente.component.html',
  styleUrls: ['./ver-historial-medico-paciente.component.scss']
})
export class VerHistorialMedicoPacienteComponent implements OnInit {

  historial: any = {};

  constructor(
    
    private route: ActivatedRoute, private HistorialService: HistorialService
) { }

  ngOnInit(): void {
    const idHistorial = this.route.snapshot.paramMap.get('id');
    console.log('aqui esta el id del historial',idHistorial)
    if (idHistorial) {
      this.cargarHistorial(idHistorial);
  } else {
      console.error('No se proporcionó un ID de factura válido.');
      
  }
}

cargarHistorial(id: string) {
  const idHistorial = +id;
  this.HistorialService.getHistorialPorId(idHistorial)
  .subscribe((response:any) => {
        console.log('aqui esta la respuesta',response);
        console.log('aqui esta la respuesta completa',response)
          this.historial = response;
          console.log('historial cargada:', this.historial);
    
  }, error => {
      console.error('Error al cargar la factura:', error);
  });
}

}
