import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class medicGuard implements CanActivate {

  constructor( private AuthService: AuthService,
               private router: Router ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      console.log('CanActivate is being executed en medicos');
    
      if (this.AuthService.medico?.rol === 'MEDICO_ROLE') {
        console.log('AQUI ESTA EL ROL DEL MEDICO',this.AuthService.medico.rol )
        return true;
      } else {
        this.router.navigateByUrl('/auth/login');
        return false;
      }

      // return (this.usuarioService.role === 'ADMIN_ROLE') ? true : false;

  }
  
}
