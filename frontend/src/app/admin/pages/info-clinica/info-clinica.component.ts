import { Component, OnInit } from '@angular/core';
import { InfoclinicaService } from '../services/infoclinica.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-info-clinica',
  templateUrl: './info-clinica.component.html',
  styleUrls: ['./info-clinica.component.scss']
})
export class InfoClinicaComponent implements OnInit {

  infoClinica: any;


  constructor(private InfoclinicaService: InfoclinicaService){}


  ngOnInit(): void {
    this.cargarInfoClinica();
  }

  cargarInfoClinica() {
    this.InfoclinicaService.cargarInfoClinica()
      .subscribe((response: any) => {
      
      
        this.infoClinica = response.Info[0];
        console.log(this.infoClinica);

      });
  }

  borrarInfoClinica( id: number ) {

    Swal.fire({
      title: '¿Borrar médico?',
      text: `Esta a punto de borrar la clinica, esta seguro?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {
        
        this.InfoclinicaService.borrarInfoClinica( id )
          .subscribe( resp => {
            
            this.cargarInfoClinica();
            Swal.fire(
              'Informacion de clinica borrada',
              `La informacion de la clinica fue borrada exitosamente`,
              'success'
            );
            
          });

      }
    })

  }


  

}
