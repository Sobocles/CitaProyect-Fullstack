import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class patientGuard implements CanActivate {

  constructor( private AuthService: AuthService,
               private router: Router ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    
      if (this.AuthService.usuario?.rol === 'USER_ROLE') {
        console.log('AQUI ESTA EL ROL DEL USUARIO',this.AuthService.usuario.rol )
        return true;
      } else {
        this.router.navigateByUrl('/auth/login');
        return false;
      }

      // return (this.usuarioService.role === 'ADMIN_ROLE') ? true : false;

  }
  
}
