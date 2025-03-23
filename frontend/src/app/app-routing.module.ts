import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanLoad } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { AdminGuard } from './auth/guards/admin.guard';
import { medicGuard } from './auth/guards/medic.guard';
import { patientGuard } from './auth/guards/patient.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    
    path: 'paciente',
    loadChildren: () => import('./pacientes/pacientes.module').then((m) => m.PacientesModule),
    canActivate: [AuthGuard, patientGuard], // Aplica el AuthGuard a esta ruta
   
  },
  {
    path: 'ad',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard, AdminGuard], // Aplica el AuthGuard a esta ruta
  
  },
  {
    path: 'medicos',
    loadChildren: () => import('./medicos/medicos.module').then((m) => m.MedicosModule),
    canActivate: [AuthGuard, medicGuard], // Aplica el AuthGuard a esta ruta
    
 
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule]
})
export class AppRoutingModule { }
