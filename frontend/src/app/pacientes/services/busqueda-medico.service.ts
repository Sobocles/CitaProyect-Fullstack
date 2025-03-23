import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import {  BehaviorSubject, Observable } from 'rxjs';
import { BloquesResponse } from '../pages/interfaces/busqueda-medicos';
import { Bloque } from '../pages/interfaces/busqueda-medicos';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedaMedicoService {
  
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

  private bloquesSubject: BehaviorSubject<Bloque[]> = new BehaviorSubject<Bloque[]>([]);
  public bloques$: Observable<Bloque[]> = this.bloquesSubject.asObservable();

  constructor(private http: HttpClient){}

  buscarHorarioDisponible(formData:any): Observable<BloquesResponse> {
    const url = `${base_url}/busqueda_cita`;
    return this.http.post<BloquesResponse>(url, formData, this.headers);
}

    actualizarBloques(data: Bloque[]): void {
      this.bloquesSubject.next(data);
    }
/*
    pagarCita(precio: number): Observable<any> {
      const url = `${base_url}/paypal/create-order`; // Sustituye con el endpoint correcto
      return this.http.post(url, { appointmentPrice: precio });
    }
 */  

    pagarCita(precio: number, especialidad: string, idCita: number): Observable<any> {
      const url = `${base_url}/mercadoPago/create-order`;
      // Incluye ambos, el precio y la especialidad, en el cuerpo de la petición
      return this.http.post(url, { precio: precio, motivo: especialidad, idCita },this.headers);
    }
    
  
}

