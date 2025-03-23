import { Model, DataTypes, Association } from 'sequelize';
import db from '../db/connection';
import { CitaMedica } from './cita_medica';

export interface FacturaAttributes {
    id_factura?: number;
    id_cita: number;
    payment_method_id?: string;
    transaction_amount?: number;
    payment_status?: string;
    status_detail?: string;
    monto_pagado?: number;
    estado_pago?: string;
    fecha_pago?: Date;
    estado?: string; 
    citaMedica?: CitaMedica;
}

export class Factura extends Model<FacturaAttributes> implements FacturaAttributes {
    public id_factura!: number;
    public id_cita!: number;
    public payment_method_id!: string;
    public transaction_amount!: number;
    public payment_status!: string;
    public status_detail!: string;
    public monto_pagado!: number;
    public estado_pago!: string;
    public fecha_pago!: Date;
    public estado!: string; // Nuevo campo agregado
    public citaMedica?: CitaMedica;

    public static associations: {
        citaMedica: Association<Factura, CitaMedica>;
    };
}

Factura.init({
    id_factura: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_cita: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'citamedicas',
            key: 'idCita',
        },
    },
    payment_method_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    transaction_amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    payment_status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status_detail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    monto_pagado: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    estado_pago: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'pendiente',
    },
    fecha_pago: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    estado: { // Nuevo campo agregado
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'activo',
    },
}, {
    sequelize: db,
    modelName: 'Factura',
});

export default Factura;
