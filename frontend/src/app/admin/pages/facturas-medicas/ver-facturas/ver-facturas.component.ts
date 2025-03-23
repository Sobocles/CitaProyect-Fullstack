import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../../services/factura.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BusquedasService } from '../../services/busquedas.service';
import { Factura } from '../../../../pacientes/pages/interfaces/payment';

@Component({
  selector: 'app-ver-facturas',
  templateUrl: './ver-facturas.component.html',
  styleUrls: ['./ver-facturas.component.scss']
})
export class VerFacturasComponent implements OnInit {

  facturas: any[] = []; // Arreglo para almacenar las facturas
  public desde: number = 0;
  public totalFacturas: number = 0; 

  constructor(private FacturaService: FacturaService, private router: Router, private BusquedasService: BusquedasService) { } // Inyecta tu servicio aquí

  ngOnInit(): void {
    this.cargarFacturas();
   
  }

  cargarFacturas() {
    this.FacturaService.cargarAllFactura(this.desde)
    .subscribe((data: any) => {
      this.totalFacturas = data.total;
      this.facturas = data.facturas;
  
    }, error => {
      console.error('Error al cargar las facturas:', error);
    });
  }

  cambiarPagina(nuevoOffset: number) {
    this.desde = nuevoOffset;

    if( this.desde < 0){ 
      this.desde = 0;
    } else if( this.desde >= this.totalFacturas ){ 
      this.desde -= nuevoOffset;
    }
    this.cargarFacturas(); 
  }


  borrarFactura( factura: number ) {

    Swal.fire({
      title: '¿Borrar factura?',
      text: `Esta seguro que desea eliminar la factura ${ factura } primero asegurese de haber imprimido la factura o de contar con algun otro tipo de respaldo`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {
        
        this.FacturaService.borrarFactura( factura )
          .subscribe( resp => {
            
          
            Swal.fire(
              'Factura borrado',
              `${ factura } fue eliminado correctamente`,
              'success'
            );
            
          });

      }
    })

  }

  buscar(termino: string): void {
    console.log('aqui esta el termino',termino);
    if (termino.length === 0) {
      return this.cargarFacturas(); 
    }

    this.BusquedasService.buscar('facturas', termino)
      .subscribe((resp: any) => { 
        console.log('aqui esta la respuesta',resp);
      
        this.facturas = resp.citas
        console.log('aqui esta la factura',this.facturas);
 
      });
  }

}
