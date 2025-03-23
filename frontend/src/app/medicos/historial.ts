export interface Medico {
    nombre: string;
    apellidos: string;
}

export interface Historial {
    id_historial: number;
    diagnostico: string;
    medicamento: string;
    notas: string;
    fecha_consulta: string;
    archivo: string;
    createdAt: string;
    updatedAt: string;
    rut_medico: string; 
    rut_paciente: string; 
    medico: Medico; 
}

export interface HistorialResponse {
    historiales: Historial[];
    total: number;
}
