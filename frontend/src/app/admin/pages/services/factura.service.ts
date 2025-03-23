import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

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

  cargarAllFactura( desde: number ) {
    //localhost:3000/api/usuarios?desde=0
    const url = `${ base_url }/mercadoPago/factura?desde=${ desde }`;
    return this.http.get( url, this.headers)
       
        
  }
  obtenerFacturaPorId(  id : string ){ 
    
    console.log('aqui llega el id',id);
    return this.http.get(`${ base_url }/mercadoPago/factura/${id}`, this.headers) 
     
  }

  borrarFactura( id: number ){
    console.log(id);
    const url = `${ base_url }/factura/${ id }`;
    return this.http.delete( url, this.headers );
  }

}
