export interface MedicoResponse {
  ok: boolean;
  total: number;
  medicos: Medico[];
}

export interface Medico {
  rut: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  direccion: string;
  foto: string;
  nacionalidad: string;
  especialidad_medica: string;
  password: string;

}

  