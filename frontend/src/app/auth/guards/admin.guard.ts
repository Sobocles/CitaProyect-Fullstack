import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor( private AuthService: AuthService,
               private router: Router ) {}

  canActivate(
    
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      console.log('OLAAAAAAAAA');
      if (this.AuthService.usuario?.rol === 'ADMIN_ROLE') {
        console.log('aqui esta el rol del usuario',this.AuthService.usuario?.rol )
        return true;
      } else {
        this.router.navigateByUrl('/auth/login');
        return false;
      }

      // return (this.usuarioService.role === 'ADMIN_ROLE') ? true : false;

  }
  
}
