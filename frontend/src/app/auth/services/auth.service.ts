import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { Observable, catchError, throwError, map, of, tap } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Usuario } from 'src/app/models/usuario';
import { RegisterForm } from '../interfaces/register-form.register';
import { Paciente } from 'src/app/admin/pages/interface/paciente';
import { Medico } from 'src/app/models/medico';
import { InfoClinica } from 'src/app/models/infoClinica';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public usuario!: Usuario;
  public medico!: Medico;
  public infoClinica!: InfoClinica;

  constructor(private http: HttpClient) {
    this.validarToken()
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { 
      headers: {
      'x-token': this.token //ESTE ES EL GET TOKEN
      }
    }
  }
  guardarLocalStorage( token: string, menu: any ) {
    localStorage.setItem('token', token );
    localStorage.setItem('menu', JSON.stringify(menu) ); //El localStorage solo guarda string por lo tanto hay que convertir el menu (porque es un arreglo de objetos)
  }
  



  login(email: string, password: string) {
    const body = { email, password };
    return this.http.post(`${base_url}/login`, body).pipe(
      tap((resp: any) => {
        console.log(resp.menu);
        this.guardarLocalStorage(resp.token, resp.menu);
      }),
      catchError(error => {
        // Pasar el error al componente
        return throwError(error);
      })
    );
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu'); 
  }

  //http://localhost:3006/api
  crearUsuario( formData: RegisterForm  ): Observable<RegisterForm>{
    console.log('creando usuario')    
    return this.http.post<RegisterForm>(`${base_url}/usuarios`,formData)
        .pipe(
            tap( (resp:any) => { 
             
              
            })
        )
  }
      /*

    constructor( 
        nombre: string,
        apellidos: string,
        email: string,
        password: string,
        fecha_nacimiento: string,
        telefono: string,
        direccion: string,
  
        public rol?: 'ADMIN_ROLE' | 'USER_ROLE',
        public uid?: string,
     ) {}

      */


     validarToken(): Observable<boolean> {
      console.log('entro a validar token');
      const options = {
          headers: new HttpHeaders({
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
      };
  
      return this.http.post(`${base_url}/login/revalidarToken`, {}, options).pipe(
          map((resp: any) => {
              this.guardarLocalStorage(resp.token, resp.menu); 
              const { rut, nombre, apellidos, rol } = resp.userOrMedico;
              
              // Comprueba si existe información de la clínica antes de crear una instancia
              if (resp.infoClinica) {
                  const { nombreClinica, direccion, telefono, email  } = resp.infoClinica;
                  this.infoClinica = new InfoClinica(nombreClinica, direccion, telefono, email);
              } else {
                  // Manejo de situación donde no hay datos de clínica
                   // O asigna valores predeterminados si es necesario
              }
  
              // Comprobamos el rol para determinar si instanciamos un Usuario o un Medico
              if (rol === 'MEDICO_ROLE') {
                  this.medico = new Medico(nombre, apellidos, rol, rut);
                  console.log('aqui esta el medico instanciado', this.medico);
              } else { // Por defecto, asumimos que es un Usuario
                  this.usuario = new Usuario(nombre, apellidos, rol, rut);
                  console.log('aqui esta el usuario',this.usuario.rol);
              }
  
              console.log(this.infoClinica, this.usuario, this.medico);
  
              return true;
          }),
          catchError((error) => of(false))
      );
  }

  
     recuperarPassword(nombre: string, email: string) {

      const url = `${base_url}/login/RecuperarPassword`;
      const body = {
        nombre,
        email
      };
  
      return this.http.post<Paciente>(url, body).pipe(
        map((resp: Paciente) => {
          return resp.ok;
        }),
        catchError(err => of(err.error.msg))
      );
    }

    cambiarPassword(rut: string, password: string, newPassword: string){
      if (localStorage.getItem('token')) {
        const url = `${base_url}/usuarios/cambiarPassword`;
        const headers = new HttpHeaders({
          'authorization': `Bearer ${localStorage.getItem('token')}`
        });
        const options = { headers: headers }
        const body = {
          rut,
          password,
          newPassword
        }
        return this.http.post<any>(url, body, options).pipe(
          map((resp: any) => {
            return resp.ok;
          }),
          catchError(err => of(err.error.msg))
        );
      } else {
        return of(false);
      }
    }

    cambiarPasswordMedico(rut: string, password: string, newPassword: string){
      if (localStorage.getItem('token')) {
        const url = `${base_url}/medicos/cambiarPassword`;
        const headers = new HttpHeaders({
          'authorization': `Bearer ${localStorage.getItem('token')}`
        });
        const options = { headers: headers }
        const body = {
          rut,
          password,
          newPassword
        }
        return this.http.post<any>(url, body, options).pipe(
          map((resp: any) => {
            return resp.ok;
          }),
          catchError(err => of(err.error.msg))
        );
      } else {
        return of(false);
      }
    }



  




}
