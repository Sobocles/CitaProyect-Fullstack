// historial.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HistorialService } from '../services/historial.service';
import { AuthService } from '../../auth/services/auth.service';
import { PacienteService } from 'src/app/admin/pages/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {
  historialMedicoForm: FormGroup;
  isEditMode: boolean = false;
  historialId: number | null = null;
  formularioIntentadoEnviar: boolean = false;
  // Agrega la propiedad para guardar los pacientes
  pacientes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private historialService: HistorialService,
    public AuthService: AuthService,
    private pacienteService: PacienteService  // Inyecta el servicio de pacientes
  ) {
    // Crea el formulario con sus validaciones
    this.historialMedicoForm = this.fb.group({
      id_historial_medico: [''],
      diagnostico: ['', Validators.required],
      medicamento: [''],
      notas: [''],
      fecha_consulta: [new Date().toISOString().split('T')[0], Validators.required],
      rut_paciente: ['', Validators.required],
      rut_medico: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const rut_medico = this.AuthService.medico.rut;
    this.pacienteService.cargarAllPacientesEnCurso(rut_medico).subscribe(
      (data: any) => {
        this.pacientes = data.usuarios; // Asumiendo que la respuesta tiene la propiedad "usuarios"
      },
      error => {
        console.error('Error al cargar pacientes:', error);
      }
    );
  
    const idParam = this.route.snapshot.paramMap.get('id');
    console.log("aqui el idParam",idParam);
    if (idParam) {
      this.isEditMode = true;
      this.historialId = +idParam;
      this.historialService.getHistorialPorId(this.historialId).subscribe(
        (response: any) => {
          this.historialMedicoForm.patchValue({
            id_historial_medico: response.id_historial,
            diagnostico: response.diagnostico,
            medicamento: response.medicamento,
            notas: response.notas,
            fecha_consulta: response.fecha_consulta,
            rut_paciente: response.rut_paciente,
            rut_medico: response.rut_medico
          });
        },
        error => {
          console.error('Error al cargar el historial:', error);
        }
      );
    } else {
      this.isEditMode = false;
      this.historialMedicoForm.patchValue({
        rut_medico: this.AuthService.medico.rut
      });
    }
  }
  

  onSubmit(): void {
    this.formularioIntentadoEnviar = true;
    if (this.historialMedicoForm.invalid) {
      return;
    }
    const historialData = this.historialMedicoForm.value;
  
    if (this.isEditMode) {
      this.historialService.editarHistorial(historialData).subscribe(
        response => {
          Swal.fire('Éxito', 'Historial editado exitosamente', 'success');
          this.router.navigate(['/gestionar-historiales']);
        },
        error => {
          Swal.fire('Error', 'Hubo un error al editar el historial', 'error');
        }
      );
    } else {
      // Remover la propiedad "id_historial_medico" para no enviarla vacía
      delete historialData.id_historial_medico;
      this.historialService.crearHistorial(historialData).subscribe(
        response => {
          console.log("response del historial creado");
          Swal.fire('Éxito', 'Historial creado exitosamente', 'success');
          this.router.navigate(['/gestionar-historiales']);
        },
        error => {
          Swal.fire('Error', 'Hubo un error al crear el historial', 'error');
        }
      );
    }
  }
  
}
