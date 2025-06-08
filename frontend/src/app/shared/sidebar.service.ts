import { Injectable } from '@angular/core';

export interface MenuItem {
  label: string;
  icon?: string;
  url: string;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public menu: MenuItem[] = [];
  
  constructor() {
    this.cargarMenu();
  }
  
  /**
   * Carga el menú desde localStorage y asigna iconos por defecto si no existen
   */
  cargarMenu(): void {
    const menuFromLocalStorage = localStorage.getItem('menu');
    
    if (menuFromLocalStorage) {
      try {
        // Cargar menú del localStorage
        const parsedMenu = JSON.parse(menuFromLocalStorage);
        
        // Asignar iconos por defecto según la URL si no existen
        this.menu = parsedMenu.map((item: MenuItem) => {
          if (!item.icon) {
            item.icon = this.getDefaultIcon(item.url);
          }
          return item;
        });
        
        console.log('Menú cargado:', this.menu);
      } catch (error) {
        console.error('Error al parsear el menú:', error);
        this.menu = [];
      }
    } else {
      console.log('No se encontró menú en localStorage');
      this.menu = [];
    }
  }
  
  /**
   * Obtiene un icono por defecto basado en la URL del elemento de menú
   */
  private getDefaultIcon(url: string): string {
    if (url.includes('dashboard')) return 'dashboard';
    if (url.includes('profile')) return 'person';
    if (url.includes('user')) return 'people';
    if (url.includes('medic')) return 'local_hospital';
    if (url.includes('patient')) return 'healing';
    if (url.includes('appointment')) return 'event';
    if (url.includes('report')) return 'assessment';
    if (url.includes('setting')) return 'settings';
    if (url.includes('chart')) return 'bar_chart';
    
    // Icono por defecto
    return 'chevron_right';
  }
}