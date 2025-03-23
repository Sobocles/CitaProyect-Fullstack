import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HorarioMedico, HorarioResponse } from '../interface/horarioMedico';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environment/environment';
import { BloquesResponse } from 'src/app/pacientes/pages/interfaces/busqueda-medicos';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HorarioMedicoService {

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



  constructor( private http: HttpClient) { }

  crearHorario( formData: HorarioMedico  ){    
    return this.http.post<HorarioMedico>(`${base_url}/horario_medico`,formData, this.headers)

  }

  obtenerHorarioPorId(  horarioId: number ){ 
    
    return this.http.get(`${ base_url }/horario_medico/${horarioId}`, this.headers) 
     
  }

  cargarHorario(desde: number = 0) {
    const url = `${base_url}/horario_medico?desde=${desde}`;
    return this.http.get<HorarioResponse>(url, this.headers);
  }

  borrarHorario( id: number ){
    console.log(id);
    const url = `${ base_url }/horario_medico/${ id }`;
    return this.http.delete( url, this.headers );
  }

  editarHorario(horario: HorarioMedico): Observable<any> {
    return this.http.put(`${ base_url }/horario_medico/${horario.idHorario}`, horario, this.headers);
  }

  buscarHorarioDisponible(formData:any): Observable<BloquesResponse> {
    console.log('ESTE ES EL FORMDATA',formData);
    const url = `${base_url}/busqueda_cita`;
    return this.http.post<BloquesResponse>(url, formData);
}



}
