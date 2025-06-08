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
exports.HistorialMedicoService = void 0;
const HistorialMedicoRepository_1 = __importDefault(require("../repositories/HistorialMedicoRepository"));
const CitaRepository_1 = __importDefault(require("../repositories/CitaRepository")); // Asume que existe
const sequelize_1 = require("sequelize");
class HistorialMedicoService {
    // Obtener todos los historiales médicos
    getHistoriales() {
        return __awaiter(this, void 0, void 0, function* () {
            return HistorialMedicoRepository_1.default.findAndCountAll({});
        });
    }
    // Obtener historiales de un paciente (con paginación)
    getHistorialPaciente(rut_paciente, desde, limite) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {
                rut_paciente,
                estado: 'activo'
            };
            const include = [{
                    association: 'medico',
                    where: { estado: 'activo' },
                    attributes: ['nombre', 'apellidos']
                }];
            const { count, rows } = yield HistorialMedicoRepository_1.default.findAndCountAll({
                where,
                include,
                offset: desde,
                limit: limite,
                attributes: { exclude: ['rut_medico'] }
            });
            return { count, historiales: rows };
        });
    }
    // Obtener historiales de un médico (con paginación)
    getHistorialMedico(rut_medico, desde, limite) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {
                rut_medico,
                estado: 'activo'
            };
            const include = [{
                    association: 'paciente',
                    where: { estado: 'activo' },
                    attributes: ['nombre', 'apellidos', 'rut']
                }];
            const { count, rows } = yield HistorialMedicoRepository_1.default.findAndCountAll({
                where,
                include,
                offset: desde,
                limit: limite,
                attributes: { exclude: ['rut_paciente'] }
            });
            return { count, historiales: rows };
        });
    }
    // Obtener un historial por su ID
    getHistorialPorId(id_historial) {
        return __awaiter(this, void 0, void 0, function* () {
            return HistorialMedicoRepository_1.default.findByPk(id_historial);
        });
    }
    // Crear un historial médico y actualizar cita relacionada
    crearHistorial(historialData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar si ya existe
            const historialExistente = yield HistorialMedicoRepository_1.default.findByPk(historialData.id_historial_medico);
            if (historialExistente) {
                throw new Error('Ya existe un historial médico con el mismo ID');
            }
            // Buscar cita médica relacionada
            const citaRelacionada = yield CitaRepository_1.default.findOne({
                where: {
                    rut_paciente: historialData.rut_paciente,
                    rut_medico: historialData.rut_medico,
                    estado: { [sequelize_1.Op.or]: ['en_curso', 'pagado'] }
                }
            });
            if (!citaRelacionada) {
                throw new Error('No se encontró cita médica relacionada');
            }
            // Actualizar estado de la cita
            yield CitaRepository_1.default.update(citaRelacionada, { estado: 'terminado' });
            // Crear el historial médico
            return HistorialMedicoRepository_1.default.create(historialData);
        });
    }
    // Actualizar un historial médico
    actualizarHistorial(id_historial, historialData) {
        return __awaiter(this, void 0, void 0, function* () {
            const historial = yield HistorialMedicoRepository_1.default.findByPk(id_historial);
            if (!historial)
                throw new Error('Historial no encontrado');
            return HistorialMedicoRepository_1.default.update(historial, historialData);
        });
    }
    // Eliminar (soft delete) un historial médico
    eliminarHistorial(id_historial) {
        return __awaiter(this, void 0, void 0, function* () {
            const historial = yield HistorialMedicoRepository_1.default.findByPk(id_historial);
            if (!historial)
                throw new Error('Historial no encontrado');
            return HistorialMedicoRepository_1.default.update(historial, { estado: 'inactivo' });
        });
    }
}
exports.HistorialMedicoService = HistorialMedicoService;
exports.default = new HistorialMedicoService();
//# sourceMappingURL=historialmedico.service.js.map