import { Injectable, OnInit } from '@angular/core';
import { Paciente, UsuariosResponse } from '../interface/paciente';
import { environment } from 'src/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface DeleteResponse {
  msg: string;
}

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})

export class PacienteService  {

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


  cargarPacientes( desde:number=0):Observable<UsuariosResponse> {
    //localhost:3000/api/usuarios?desde=0
    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<UsuariosResponse>( url, this.headers)      
  }

  cargarAllPacientes():Observable<UsuariosResponse> {
    //localhost:3000/api/usuarios?desde=0
    const url = `${ base_url }/usuarios/all`;
    return this.http.get<UsuariosResponse>( url, this.headers)      
  }

  cargarAllPacientesEnCurso(rut_medico:string):Observable<UsuariosResponse> {
    //localhost:3000/api/usuarios?desde=0
    const url = `${ base_url }/usuarios/allCurso/${ rut_medico }`;
    return this.http.get<UsuariosResponse>( url, this.headers)      
  }
  
  cargarAllPacientesEnCursoTerminado(rut_medico:string):Observable<UsuariosResponse> {
    //localhost:3000/api/usuarios?desde=0
    const url = `${ base_url }/usuarios/allCursoTerminado/${ rut_medico }`;
    return this.http.get<UsuariosResponse>( url, this.headers)      
  }

  borrarPaciente( id: string ){
    console.log(id);
    const url = `${ base_url }/usuarios/${ id }`;
    return this.http.delete<DeleteResponse>( url, this.headers );
  }

  crearPaciente( formData: Paciente  ){    
    return this.http.post<Paciente>(`${base_url}/usuarios`,formData,this.headers)

  }

  guardarUsuario(paciente: Paciente){
    console.log(paciente);
    return this.http.put(`${ base_url }/usuarios/${paciente.rut}`, paciente, this.headers);
  }

  
  editarUsuario(usuario: any): Observable<any> {
    return this.http.put(`${ base_url }/usuarios/${usuario.rut}`, usuario, this.headers);
  }

  obtenerUsuarioPorId(  usuarioId:string ){ //aca role no viene como parametro (viene email y nombre en this.perfilForm.value) pero aun asi funciona ya que role simplemente se ignora
    
    console.log(usuarioId);
    return this.http.put(`${ base_url }/usuarios/${usuarioId}`, this.headers) //Para actualizar los datos del usuario se necesita enviar al backend El id que se obtiene de un metodo get que me da el id del usuario logeado que es el mismo que esta intentando actualizar sus datos, la data que se quiere actualizar que es enviada por un formulario y los header con el token de acceso
     
  }

  

}
