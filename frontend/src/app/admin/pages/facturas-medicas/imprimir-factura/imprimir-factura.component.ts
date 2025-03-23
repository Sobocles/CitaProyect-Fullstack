import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacturaService } from '../../services/factura.service';

@Component({
  selector: 'app-imprimir-factura',
  templateUrl: './imprimir-factura.component.html',
  styleUrls: ['./imprimir-factura.component.scss']
})
export class ImprimirFacturaComponent {
  factura: any = {};

  constructor(
      private facturaService: FacturaService,
      private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const idFactura = this.route.snapshot.paramMap.get('id');

    if (idFactura) {
        this.cargarFactura(idFactura);
    } else {
        console.error('No se proporcionó un ID de factura válido.');
 
    }
}

cargarFactura(id: string) {
  // Llamada al servicio para obtener los detalles de la factura
  this.facturaService.obtenerFacturaPorId(id)
  .subscribe((response:any) => {
      if (response.ok && response.factura) {
        console.log('aqui esta la respuesta completa',response)
          this.factura = response.factura;
          console.log('Factura cargada:', this.factura);
      } else {
          console.error('La factura no se encontró o la respuesta no es válida.');
          // Manejar el caso en que la factura no se encuentra o la respuesta no es como se espera
      }
  }, error => {
      console.error('Error al cargar la factura:', error);
  });
}

}
