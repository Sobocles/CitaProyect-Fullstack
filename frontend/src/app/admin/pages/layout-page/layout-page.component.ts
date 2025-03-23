import { Component } from '@angular/core';
import { SidebarService } from 'src/app/shared/sidebar.service';

@Component({
  selector: 'app-layout-page2',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.scss']
})
export class LayoutPageComponent {
  
  constructor(private sidebarService: SidebarService){}

  ngOnInit(): void {

    this.sidebarService.cargarMenu();
  

  }

}
