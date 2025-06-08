import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    console.log('🛡️ AuthGuard - canActivate iniciado');
    return this.authService.validarToken().pipe(
      tap((valid) => {
        console.log('🛡️ Resultado de validación de token:', valid);
        if (!valid) {
          console.log('🛡️ Redireccionando a /auth porque el token no es válido');
          this.router.navigate(['/auth']);
        } else {
          console.log('🛡️ Token válido, permitiendo navegación');
          // Verificar explícitamente qué tipo de usuario está autenticado
          if (this.authService.usuario) {
            console.log('🛡️ Usuario autenticado:', this.authService.usuario);
          } else if (this.authService.medico) {
            console.log('🛡️ Médico autenticado:', this.authService.medico);
          } else {
            console.log('🛡️ ALERTA: No hay usuario ni médico autenticado a pesar de token válido');
          }
        }
      })
    );
  }
  
  canLoad(): Observable<boolean> | boolean {
    console.log('🛡️ AuthGuard - canLoad iniciado');
    return this.authService.validarToken().pipe(
      tap((valid) => {
        console.log('🛡️ Resultado de validación de token (canLoad):', valid);
        if (!valid) {
          console.log('🛡️ Redireccionando a /auth porque el token no es válido (canLoad)');
          this.router.navigate(['/auth']);
        }
      })
    );
  }
}