import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/shared/sidebar.service';


@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.scss']
})
export class LayoutPageComponent implements OnInit{

  constructor(private sidebarService: SidebarService){}

  ngOnInit(): void {

    this.sidebarService.cargarMenu();
  

  }

}


