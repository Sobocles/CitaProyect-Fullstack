export interface Horario {
    dia: string;
    horarioApertura: string | null;
    horarioCierre: string | null;
    estado: string;
}

export interface HorarioClinicaResponse {
    ok: boolean;
    horariosClinica: Horario[];
}