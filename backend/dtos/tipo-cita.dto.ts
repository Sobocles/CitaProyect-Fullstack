// src/dtos/tipo-cita.dto.ts

// Solución para EspecialidadDto
export class EspecialidadDto {
  readonly especialidad_medica: string;

  constructor(especialidad: string) {
    this.especialidad_medica = especialidad;
  }
}

// Solución para CrearTipoCitaDto
export class CrearTipoCitaDto {
  readonly tipo_cita!: string;
  readonly precio!: number;
  readonly especialidad_medica?: string;
  readonly duracion_cita!: number;
}

export class ActualizarTipoCitaDto {
  readonly tipo_cita?: string;
  readonly precio?: number;
  readonly especialidad_medica?: string;
  readonly duracion_cita?: number;
}