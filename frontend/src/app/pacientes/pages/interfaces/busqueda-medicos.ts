export interface Bloque {
    medicoNombre: string;
    hora_inicio: string;
    hora_fin: string;
    precio: number;
    especialidad: string;
}

export interface BloquesResponse {
    ok: boolean;
    bloques: Bloque[];
}
