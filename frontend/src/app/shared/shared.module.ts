import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { PaginatorComponent } from './paginator/paginator.component';
import { MatMenuModule } from '@angular/material/menu';




@NgModule({
  declarations: [
    DashboardComponent,
    PaginatorComponent,

  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    MatMenuModule,
  ],
  exports: [DashboardComponent, PaginatorComponent],
})
export class SharedModule { }
