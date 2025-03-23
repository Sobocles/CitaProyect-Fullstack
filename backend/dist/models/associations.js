"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usuario_1 = __importDefault(require("./usuario"));
const tipo_cita_1 = __importDefault(require("./tipo_cita"));
const cita_medica_1 = __importDefault(require("./cita_medica"));
const medico_1 = __importDefault(require("./medico"));
const horario_medico_1 = __importDefault(require("./horario_medico"));
const historial_medico_1 = __importDefault(require("./historial_medico"));
const factura_1 = __importDefault(require("./factura"));
// Asociaciones para Usuario
usuario_1.default.hasMany(cita_medica_1.default, { foreignKey: 'rut_paciente', sourceKey: 'rut', onDelete: 'CASCADE' });
usuario_1.default.hasMany(historial_medico_1.default, { foreignKey: 'rut_paciente', sourceKey: 'rut', onDelete: 'CASCADE' });
tipo_cita_1.default.hasOne(cita_medica_1.default, { foreignKey: 'idTipoCita', sourceKey: 'idTipoCita', onDelete: 'CASCADE' });
// Asociaciones para CitaMedica
cita_medica_1.default.belongsTo(usuario_1.default, { foreignKey: 'rut_paciente', targetKey: 'rut', as: 'paciente', onDelete: 'CASCADE' });
cita_medica_1.default.belongsTo(medico_1.default, { foreignKey: 'rut_medico', targetKey: 'rut', as: 'medico' });
cita_medica_1.default.belongsTo(tipo_cita_1.default, { foreignKey: 'idTipoCita', targetKey: 'idTipoCita', as: 'tipoCita', onDelete: 'CASCADE' });
cita_medica_1.default.hasOne(factura_1.default, { foreignKey: 'id_cita', sourceKey: 'idCita', as: 'factura', onDelete: 'CASCADE' });
// Asociaciones para Medico
medico_1.default.hasMany(cita_medica_1.default, { foreignKey: 'rut_medico', sourceKey: 'rut' });
medico_1.default.hasMany(horario_medico_1.default, { foreignKey: 'rut_medico', sourceKey: 'rut', onDelete: 'CASCADE' });
horario_medico_1.default.belongsTo(medico_1.default, { foreignKey: 'rut_medico', targetKey: 'rut', as: 'medico', onDelete: 'CASCADE' });
// Asociación de HistorialMedico con Usuario
historial_medico_1.default.belongsTo(usuario_1.default, { foreignKey: 'rut_paciente', targetKey: 'rut', as: 'paciente', onDelete: 'CASCADE' });
// Asociación de Factura con CitaMedica
factura_1.default.belongsTo(cita_medica_1.default, { foreignKey: 'id_cita', targetKey: 'idCita', as: 'citaMedica', onDelete: 'CASCADE' });
historial_medico_1.default.belongsTo(medico_1.default, { foreignKey: 'rut_medico', targetKey: 'rut', as: 'medico', onDelete: 'CASCADE' });
//# sourceMappingURL=associations.js.map