"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Define el modelo de HorarioLaboral
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class HorarioClinica extends sequelize_1.Model {
}
HorarioClinica.init({
    dia: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    horaInicio: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    horaFin: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    rut_medico: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: connection_1.default,
    modelName: 'HorarioClinica',
    tableName: 'horarios_clinica',
});
exports.default = HorarioClinica;
//# sourceMappingURL=horario_clinica.js.map