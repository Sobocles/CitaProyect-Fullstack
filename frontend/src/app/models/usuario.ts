import { environment } from "src/environment/environment";

const base_url = environment.base_url;

/*
    export interface Paciente {
    rut: string;
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    fecha_nacimiento: string;
    telefono: string;
    direccion: string;
  }
  

*/
export class Usuario {

    constructor( 
        public nombre: string,
        public apellidos: string,
  
        public rol: 'ADMIN_ROLE' | 'USER_ROLE',
        public rut: string,
     ) {}




/*
     get imagenUrl(){ //UNA FUNCION QUE RETORNA LA DIRECCION DE LA IMAGEN DEL USUARIO EN BASE A SI ESTA EXISTE O NO (SI EL USUARIO TIENE UNA IMAGEN O NO) PARA PODER MOSTRARLA EN EL SIDEBAR, EN EL HEADERS ETC

        if( !this.img ){
            return `${ base_url }/upload/usuarios/no-image`; //SI NO TIENE IMAGEN
        } else if( this.img.includes('https') ){ //SI TIENE UNA IMAGEN DE GOOGLE
            return this.img;
        } else if ( this.img ) {
            return `${ base_url }/upload/usuarios/${ this.img }`; //SI TIENE UNA IMAGEN
        } else {
            return `${ base_url }/upload/usuarios/no-image`;
        }
      
     }
*/
}