"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class TipoCita extends sequelize_1.Model {
}
TipoCita.init({
    idTipoCita: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tipo_cita: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    precio: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    especialidad_medica: {
        type: sequelize_1.DataTypes.STRING,
    },
    duracion_cita: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    estado: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: 'activo' // Estado por defecto es 'activo'
    },
}, {
    sequelize: connection_1.default,
    modelName: 'TipoCita',
    tableName: 'tipocitas'
});
exports.default = TipoCita;
//# sourceMappingURL=tipo_cita.js.map