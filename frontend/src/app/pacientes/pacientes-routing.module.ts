import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { AgendarCitaComponent } from './pages/agendar-cita/agendar-cita.component';
import { FormularioCitaComponent } from './pages/formulario-cita/formulario-cita.component';
import { RouterModule, Routes } from '@angular/router';
import { BusquedaMedicoComponent } from './pages/busqueda-medico/busqueda-medico.component';
import { HistorialPacienteComponent } from './pages/Historial-medico/historial-paciente/historial-paciente.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { PaymentFailureComponent } from './pages/payment-failure/payment-failure.component';
import { patientGuard } from '../auth/guards/patient.guard';
import { CambiarPasswordComponent } from './pages/cambiar-password/cambiar-password.component';
import { VerCitasPacienteComponent } from './pages/ver-citas-paciente/ver-citas-paciente.component';
import { InicioPacienteComponent } from './pages/inicio-paciente/inicio-paciente.component';
import { VerHistorialMedicoPacienteComponent } from './pages/Historial-medico/ver-historial-medico-paciente/ver-historial-medico-paciente.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent, canActivate: [AuthGuard],
    children: [
      { path: 'inicio-paciente', component: InicioPacienteComponent, canActivate: [AuthGuard, patientGuard] },

      { path: 'Agendar-cita', component: AgendarCitaComponent, canActivate: [AuthGuard, patientGuard] },

      { path: 'formulario-cita', component: FormularioCitaComponent, canActivate: [AuthGuard, patientGuard] },

      { path: 'cambiar-password', component: CambiarPasswordComponent, canActivate: [AuthGuard, patientGuard] },

      { path: 'busqueda-medico', component: BusquedaMedicoComponent, canActivate: [AuthGuard, patientGuard] },

      { path: 'ver-cita-paciente', component: VerCitasPacienteComponent, canActivate: [AuthGuard, patientGuard] },

      { path: 'historial', component: HistorialPacienteComponent, canActivate: [AuthGuard, patientGuard] },

      { path: 'ver-historial-paciente/:id', component: VerHistorialMedicoPacienteComponent, canActivate: [AuthGuard,patientGuard] },

      { path: 'payment-success', component: PaymentSuccessComponent,canActivate: [AuthGuard, patientGuard] },

      { path: 'payment-failure', component: PaymentFailureComponent, canActivate: [AuthGuard, patientGuard]},
    ]
  }
];


@NgModule({
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ],
})
export class PacientesRoutingModule { }
