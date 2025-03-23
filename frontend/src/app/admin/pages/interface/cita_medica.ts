export interface CitaMedica {
    idCita: number;
    motivo: string;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    estado: string;
    paciente: {
      nombre: string;
      apellidos: string;
    };
    medico: {
      nombre: string;
      apellidos: string;
    };
    tipoCita: {
      especialidad_medica: string;
    };
  }
  
  export interface CitasResponse {
    ok: boolean;
    citas: CitaMedica[];
    total?: number; // La propiedad total es opcional porque solo aparece en una de las respuestas
  }
  