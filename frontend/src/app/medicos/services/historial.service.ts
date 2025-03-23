import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { Historial, HistorialResponse } from '../historial';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

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

  cargarHistorial(desde: number = 0):Observable<HistorialResponse> {
    const url = `${base_url}/historial`;
    return this.http.get<HistorialResponse>(url, this.headers);
  }

  crearHistorial(historial: Historial) {
    const url = `${base_url}/historial`; 
    return this.http.post(url, historial, this.headers);
  }

  obtenerHistorialPorId(rutPaciente: string, desde: number, limite: number = 5): Observable<HistorialResponse> { 
    const url = `${ base_url }/historial/${rutPaciente}?desde=${desde}&limite=${limite}`;
    return this.http.get<HistorialResponse>(url, this.headers); 
}
obtenerHistorialPorIdMedico(rutMedico: string, desde: number, limite: number = 5): Observable<any> { 
  const url = `${ base_url }/historial/medico/${rutMedico}?desde=${desde}&limite=${limite}`;
  return this.http.get<any>(url, this.headers); 
}

getHistorialPorId(historialId: number): Observable<any> { 
  const url = `${ base_url }/historial/porIdHistorial/${historialId}`;
  return this.http.get<any>(url, this.headers); 
}

editarHistorial(historialEditado: any): Observable<any> {
  return this.http.put(`${ base_url }/historial/${historialEditado.id_historial_medico}`, historialEditado, this.headers);
}

borrarHistorial( id: string ){
  const url = `${ base_url }/historial/${ id }`;
  return this.http.delete( url, this.headers );
}

}
