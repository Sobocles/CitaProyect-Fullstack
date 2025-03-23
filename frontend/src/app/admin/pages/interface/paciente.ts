export interface Paciente {
  ok: boolean,
  rut: string;
  nombre: string;
  apellidos: string;
  email: string;
  fecha_nacimiento: string;
  telefono: string;
  direccion: string;
  rol: string;
  toral:number;
}

export interface UsuariosResponse {
  usuarios: Paciente[];
  total: number;
}
  