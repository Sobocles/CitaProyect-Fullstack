// cita-medica.interface.ts
export interface CitaMedicaF {
    idCita: number;
    motivo: string;
    rut_paciente: string;
    rut_medico: string;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    estado: string;
    descripcion?: string;
    idTipoCita: number;
    factura?: Factura;
    medico: Medico;
    paciente: Paciente;
  }
  
  export interface Factura {
    id_factura: number;
    id_cita: number;
    payment_method_id: string;
    transaction_amount: number;
    payment_status: string;
    status_detail: string;
    monto_pagado: number;
    estado_pago: string;
  }
  
  export interface Medico {
    nombre: string;
    apellidos: string;
    especialidad_medica: string;
  }
  
  export interface Paciente {
    nombre: string;
    apellidos: string;
    email: string;
  }
  