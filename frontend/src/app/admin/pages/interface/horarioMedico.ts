
export interface HorarioMedico {
    idHorario: number;
    diaSemana: string;
    horaInicio: string;
    horaFinalizacion: string;
    inicio_colacion?: string;
    fin_colacion?: string;
    duracionCitas: number;
    rut_medico: string;
    disponibilidad: boolean;
    fechaCreacion: string;
    medico: {
      nombre: string;
      apellidos: string,
      especialidad_medica: string;
      
    };
 
  }
 
  export interface HorarioResponse {
    total: number;
    horarios: HorarioMedico[];
  }