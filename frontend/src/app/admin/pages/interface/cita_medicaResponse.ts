export interface CitasResponsex {
    ok?: boolean;  
    cita: CitaMedica;
}

export interface CitaMedica {
    idCita: number;
    motivo: string;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    estado: string;
    rut_paciente: string;
    rut_medico: string;
    tipo_cita: string;  // Cambiado de 'especialidad_medica' a 'tipo_cita'
    idTipoCita: number;
    
}