import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { PaginatorComponent } from './paginator/paginator.component';





@NgModule({
  declarations: [
    DashboardComponent,
    PaginatorComponent,

  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [DashboardComponent, PaginatorComponent],
})
export class SharedModule { }
