"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitaService = void 0;
const CitaRepository_1 = __importDefault(require("../repositories/CitaRepository"));
const sequelize_1 = require("sequelize");
class CitaService {
    // Lógica para obtener citas con paginación
    getCitas(desde, limite) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultFilters = {
                estado_actividad: 'activo',
                estado: { [sequelize_1.Op.ne]: 'no_pagado' }
            };
            return CitaRepository_1.default.findAndCountAll({
                where: defaultFilters,
                include: this.getDefaultIncludes(),
                attributes: ['idCita', 'motivo', 'fecha', 'hora_inicio', 'hora_fin', 'estado'],
                offset: desde,
                limit: limite
            });
        });
    }
    // Lógica para obtener citas de un médico
    getCitasMedico(rut_medico, desde, limite) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {
                rut_medico,
                estado: { [sequelize_1.Op.or]: ['en_curso', 'pagado', 'terminado'] },
                estado_actividad: 'activo'
            };
            const { count, rows } = yield CitaRepository_1.default.findAndCountAll({
                where,
                include: this.getDefaultIncludes(),
                attributes: { exclude: ['rut_paciente', 'rut_medico'] },
                offset: desde,
                limit: limite
            });
            return { count, citas: rows };
        });
    }
    // Lógica para obtener citas de un paciente
    getCitasPaciente(rut_paciente, desde, limite) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {
                rut_paciente,
                estado: { [sequelize_1.Op.or]: ['en_curso', 'pagado', 'terminado'] },
                estado_actividad: 'activo'
            };
            const { count, rows } = yield CitaRepository_1.default.findAndCountAll({
                where,
                include: this.getDefaultIncludes(),
                attributes: { exclude: ['rut_paciente', 'rut_medico'] },
                offset: desde,
                limit: limite
            });
            return { count, citas: rows };
        });
    }
    // Lógica para obtener cita con factura
    getCitaFactura(idCita) {
        return __awaiter(this, void 0, void 0, function* () {
            return CitaRepository_1.default.findByPk(idCita, {
                include: [
                    ...this.getDefaultIncludes(),
                    {
                        association: 'factura',
                        required: false
                    }
                ]
            });
        });
    }
    // Lógica para crear cita
    crearCita(citaData) {
        return __awaiter(this, void 0, void 0, function* () {
            return CitaRepository_1.default.create(citaData);
        });
    }
    // Lógica para verificar citas existentes de un usuario
    verificarCitasUsuario(rut_paciente) {
        return __awaiter(this, void 0, void 0, function* () {
            const citaExistente = yield CitaRepository_1.default.findOne({
                where: {
                    rut_paciente,
                    estado: { [sequelize_1.Op.or]: ['pagado', 'en_curso'] },
                    estado_actividad: 'activo'
                }
            });
            return !!citaExistente;
        });
    }
    // Lógica para crear cita como paciente
    crearCitaPaciente(citaData) {
        return __awaiter(this, void 0, void 0, function* () {
            const puedeAgendar = !(yield this.verificarCitasUsuario(citaData.rutPaciente));
            if (!puedeAgendar) {
                throw new Error('Ya tienes una cita programada');
            }
            return CitaRepository_1.default.create({
                rut_paciente: citaData.rutPaciente,
                rut_medico: citaData.rutMedico,
                fecha: citaData.fecha,
                hora_inicio: citaData.hora_inicio,
                hora_fin: citaData.hora_fin,
                estado: 'no_pagado',
                motivo: citaData.especialidad,
                idTipoCita: citaData.idTipoCita
            });
        });
    }
    // Lógica para actualizar cita
    actualizarCita(idCita, citaData) {
        return __awaiter(this, void 0, void 0, function* () {
            const cita = yield CitaRepository_1.default.findByPk(idCita);
            if (!cita)
                throw new Error('Cita no encontrada');
            return CitaRepository_1.default.update(cita, citaData);
        });
    }
    // Lógica para eliminar (soft delete) cita
    eliminarCita(idCita) {
        return __awaiter(this, void 0, void 0, function* () {
            const cita = yield CitaRepository_1.default.findByPk(idCita);
            if (!cita)
                throw new Error('Cita no encontrada');
            return CitaRepository_1.default.update(cita, { estado_actividad: 'inactivo' });
        });
    }
    getDefaultIncludes() {
        return [
            { association: 'paciente', attributes: ['nombre', 'apellidos'] },
            { association: 'medico', attributes: ['nombre', 'apellidos'] },
            { association: 'tipoCita', attributes: ['especialidad_medica'] }
        ];
    }
}
exports.CitaService = CitaService;
exports.default = new CitaService();
//# sourceMappingURL=Cita.service.js.map