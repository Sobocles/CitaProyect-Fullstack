import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../sidebar.service';
import { AuthService } from '../../auth/services/auth.service';

interface MenuItem {
  label: string;
  icon?: string;
  url: string;
  category?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  // Menú agrupado por categorías
  groupedMenu: { [key: string]: MenuItem[] } = {};

  constructor(
    private router: Router,
    public sidebarService: SidebarService,
    public authService: AuthService
  ) {}
  
  ngOnInit(): void {
    // Agrupar menú por categorías cuando se cargue el componente
    this.groupMenuItems();
    
    // Verificar estado de autenticación
    this.checkAuthState();
  }
  
  /**
   * Agrupa los elementos del menú por categoría
   */
  groupMenuItems(): void {
    this.groupedMenu = {};
    
    // Procesar elementos del menú y agruparlos por categoría
    this.sidebarService.menu.forEach((item: MenuItem) => {
      const category = item.category || 'General';
      
      if (!this.groupedMenu[category]) {
        this.groupedMenu[category] = [];
      }
      
      this.groupedMenu[category].push(item);
    });
  }
  
  /**
   * Verifica el estado de autenticación usando el servicio
   */
  checkAuthState(): void {
    this.authService.validarToken().subscribe(
      valid => {
        if (!valid) {
          this.router.navigate(['/auth']);
        }
      }
    );
  }
  
  /**
   * Maneja el cierre de sesión
   */
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}