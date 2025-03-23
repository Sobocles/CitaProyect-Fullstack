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
    console.log('Se esta ejecutando el can activate'); // Agrega esta línea para verificar la ejecución
    return this.authService.validarToken().pipe(
      tap((valid) => {
        console.log(valid);
        if (!valid) {
          this.router.navigate(['/auth']);
        }
      })
    );
  }

  canLoad(): Observable<boolean> | boolean {
    console.log('CanLoad is being executed'); // Agrega esta línea para verificar la ejecución
    return this.authService.validarToken().pipe(
      tap((valid) => {
        if (!valid) {
          this.router.navigate(['/auth']);
        }
      })
    );
  }
}