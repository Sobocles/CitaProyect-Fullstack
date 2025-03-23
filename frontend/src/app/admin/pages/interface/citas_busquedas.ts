interface CitaMedica {
    idCita: number;
    motivo: string;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    estado: string;
    paciente: {
      nombre: string;
    };
    medico: {
      nombre: string;
    };
    tipoCita: {
      especialidad_medica: string;
    };
  }
  
  interface CitasResponse {
    ok: boolean;
    citas: CitaMedica[];
  }
  