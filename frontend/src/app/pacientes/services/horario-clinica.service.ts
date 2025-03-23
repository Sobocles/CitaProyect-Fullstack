import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { HorarioClinicaResponse } from '../pages/interfaces/horario_clinicas';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HorarioClinicaService {

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



  constructor(private http: HttpClient){}

  cargarHorarioClinica(): Observable<HorarioClinicaResponse> {
    const url = `${base_url}/horario_clinica`;
    return this.http.get<HorarioClinicaResponse>(url,this.headers);
  }

  obtenerHorarioEspecialidades() {

    const url = `${base_url}/horario_clinica/porEspecialidad`;
    return this.http.get(url,this.headers);
  }
}
