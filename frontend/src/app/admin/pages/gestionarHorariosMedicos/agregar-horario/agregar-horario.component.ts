import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HorarioMedicoService } from '../../services/horario-medico.service';
import { MedicoService } from '../../services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-horario-medico',
  templateUrl: './agregar-horario.component.html',
  styleUrls: ['./agregar-horario.component.scss']
})
export class AgregarHorarioMedicoComponent implements OnInit {
  horarioMedicoForm: FormGroup;
  isEditMode: boolean = false;
  horarioId: number | null = null;
  medicos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private HorarioMedicoService: HorarioMedicoService,
    private MedicoService: MedicoService
  ) {
    // Configuramos el formulario con sus validaciones
    this.horarioMedicoForm = this.fb.group({
      idHorario: [''],
      diaSemana: ['', Validators.required],
      horaInicio: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
      horaFinalizacion: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
      inicio_colacion: ['', Validators.required],
      fin_colacion: ['', Validators.required],
      rut_medico: ['', Validators.required]
    }, { validators: this.horarioColacionValidator() });
  }

  // Validador a nivel de formulario para horarios
  horarioColacionValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!(control instanceof FormGroup)) return null;

      const inicio = control.get('horaInicio')?.value;
      const fin = control.get('horaFinalizacion')?.value;
      const inicioColacion = control.get('inicio_colacion')?.value;
      const finColacion = control.get('fin_colacion')?.value;

      if (inicio && fin && inicio >= fin) {
        return { horarioLaboralInvalido: true };
      }
      if (inicio && fin && inicioColacion && finColacion) {
        if (inicio > inicioColacion || finColacion > fin) {
          return { horarioColacionFuera: true };
        }
        if (inicioColacion >= finColacion) {
          return { colacionInvalida: true };
        }
      }
      return null;
    };
  }

  ngOnInit(): void {
    // Cargar la lista de médicos para el select
    this.MedicoService.cargarMedicos().subscribe(
      (response: any) => {
        this.medicos = response.medicos;
      },
      error => {
        console.error('Error al cargar médicos', error);
      }
    );

    // Suscribirse a los parámetros de la ruta para determinar si estamos en modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.horarioId = +params['id'];
        // Cargar el horario existente para editarlo
        this.HorarioMedicoService.obtenerHorarioPorId(this.horarioId).subscribe(
          (response: any) => {
            // Suponiendo que la respuesta trae el objeto en response.horario
            const horario = response.horario;
            this.horarioMedicoForm.patchValue({
              idHorario: horario.idHorario,
              diaSemana: horario.diaSemana,
              horaInicio: horario.horaInicio,
              horaFinalizacion: horario.horaFinalizacion,
              inicio_colacion: horario.inicio_colacion,
              fin_colacion: horario.fin_colacion,
              rut_medico: horario.rutMedico // Ajusta el nombre según tu modelo
            });
          },
          error => {
            console.error('Error al cargar el horario', error);
          }
        );
      } else {
        this.isEditMode = false;
      }
    });
  }

  onSubmit(): void {
    if (this.horarioMedicoForm.invalid) return;
    const formData = { ...this.horarioMedicoForm.value };
    if (this.isEditMode) {
      this.HorarioMedicoService.editarHorario(formData).subscribe(
        response => {
          Swal.fire('Éxito', 'Horario editado exitosamente', 'success');
          this.router.navigateByUrl('/gestionar-horarios-medicos');
        },
        error => {
          Swal.fire('Error', 'Hubo un error al editar el horario', 'error');
        }
      );
    } else {
      // En creación, eliminar el campo de ID para que se genere automáticamente
      delete formData.idHorario;
      this.HorarioMedicoService.crearHorario(formData).subscribe(
        response => {
          Swal.fire('Éxito', 'Horario creado exitosamente', 'success');
          this.router.navigateByUrl('/gestionar-horarios-medicos');
        },
        error => {
          Swal.fire('Error', 'Hubo un error al crear el horario', 'error');
        }
      );
    }
  }

  regresar(): void {
    this.router.navigateByUrl('/gestionar-horarios-medicos');
  }
}
