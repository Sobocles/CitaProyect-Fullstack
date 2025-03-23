import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../sidebar.service'; // Asegúrate de que la ruta al servicio sea correcta
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(
    private router: Router,
    public sidebarService: SidebarService,
    public authService: AuthService
  ) {}

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth']); // o donde sea tu página de login
    this.authService.usuario.apellidos
  }

  // Resto del código de tu componente
}
