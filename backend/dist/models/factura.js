"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factura = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class Factura extends sequelize_1.Model {
}
exports.Factura = Factura;
Factura.init({
    id_factura: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_cita: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'citamedicas',
            key: 'idCita',
        },
    },
    payment_method_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    transaction_amount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    payment_status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    status_detail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    monto_pagado: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    estado_pago: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: 'pendiente',
    },
    fecha_pago: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    estado: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: 'activo',
    },
}, {
    sequelize: connection_1.default,
    modelName: 'Factura',
});
exports.default = Factura;
//# sourceMappingURL=factura.js.map