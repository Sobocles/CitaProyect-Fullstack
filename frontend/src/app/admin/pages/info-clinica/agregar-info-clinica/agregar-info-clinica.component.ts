import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { InfoclinicaService } from '../../services/infoclinica.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-info-clinica',
  templateUrl: './agregar-info-clinica.component.html',
  styleUrls: ['./agregar-info-clinica.component.scss']
})
export class AgregarInfoClinicaComponent {

  clinicForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private InfoclinicaService: InfoclinicaService, private router: Router) {
    this.clinicForm = this.formBuilder.group({
        nombreClinica: ['', Validators.required],
        direccion: ['', Validators.required],
        telefono: ['', [Validators.required, Validators.pattern("\\d{10}")]], // Validación para número de teléfono de 10 dígitos
        email: ['', [Validators.required, Validators.email]]
    });
}

crearInfoClinica() {
  const formData = this.clinicForm.value;
  console.log(formData);

  this.InfoclinicaService.crearInfoClinica(formData).subscribe(
    (respuesta:any) => {
       // Navegar al Dashboard ya que el registro fue EXITOSO!!
       
       Swal.fire('Mensaje', respuesta.msg, 'success');
  
    
  }, (err) => {
    Swal.fire('Error', err.error.msg, 'error'); //al incluir err.error.msg se Accede al mensaje de error incluido en el backenend en caso de que el correo ya este registrado
  } );
}

}
