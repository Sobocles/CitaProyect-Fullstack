import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from 'src/environment/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class InfoclinicaService {
  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get headers() {
    return { 
      headers: {
      'Authorization': `Bearer ${this.token}`
      }
    }
}

  constructor(private http: HttpClient) { }



  crearInfoClinica( formData: any  ){
    
    return this.http.post(`${base_url}/horario_clinica/Infoclinica`,formData, this.headers)
      
  }

  cargarInfoClinica() {
    //localhost:3000/api/usuarios?desde=0
    const url = `${ base_url }/horario_clinica/Infoclinica`;
    return this.http.get( url, this.headers)      
  }

  borrarInfoClinica( id: number ){
    console.log('AQUI ESTA EL ID DE LA CLINICA',id);
    const url = `${ base_url }/horario_clinica/Infoclinica/${ id }`;
    return this.http.delete( url, this.headers );
  }

  

}
