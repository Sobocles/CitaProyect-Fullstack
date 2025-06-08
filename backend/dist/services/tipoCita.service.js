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
exports.TipoCitaService = void 0;
const TipoCitaRepository_1 = __importDefault(require("../repositories/TipoCitaRepository"));
const sequelize_1 = require("sequelize");
const medico_1 = __importDefault(require("../models/medico"));
const cita_medica_1 = __importDefault(require("../models/cita_medica"));
const horario_medico_1 = __importDefault(require("../models/horario_medico"));
const connection_1 = __importDefault(require("../db/connection"));
class TipoCitaService {
    // Métodos para especialidades
    getAllEspecialidades() {
        return __awaiter(this, void 0, void 0, function* () {
            return TipoCitaRepository_1.default.findActiveEspecialidades();
        });
    }
    getEspecialidadesDisponibles() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        SELECT DISTINCT tc.especialidad_medica
        FROM tipocitas tc
        WHERE tc.estado = 'activo' 
        AND tc.especialidad_medica IS NOT NULL
        AND tc.especialidad_medica != ''
        AND EXISTS (
          SELECT 1 
          FROM medicos m 
          INNER JOIN horarioMedicos hm ON m.rut = hm.rut_medico
          WHERE m.estado = 'activo'
          AND m.especialidad_medica = tc.especialidad_medica
        )
        ORDER BY tc.especialidad_medica
      `;
                const [results] = yield connection_1.default.query(query);
                return results;
            }
            catch (error) {
                console.error("Error getting available specialties", error);
                return this.getAllEspecialidades();
            }
        });
    }
    // Métodos CRUD para tipos de cita
    getTipoCitas(desde, limite) {
        return __awaiter(this, void 0, void 0, function* () {
            return TipoCitaRepository_1.default.findAndCountAll({
                where: { estado: 'activo' },
                offset: desde,
                limit: limite
            });
        });
    }
    getTipoCita(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return TipoCitaRepository_1.default.findByPk(id);
        });
    }
    crearTipoCita(tipoCitaData) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedData = Object.assign(Object.assign({}, tipoCitaData), { especialidad_medica: this.normalizarEspecialidad(tipoCitaData.especialidad_medica || '') });
            const exists = yield TipoCitaRepository_1.default.findOne({
                where: {
                    especialidad_medica: normalizedData.especialidad_medica,
                    estado: 'activo'
                }
            });
            if (exists) {
                throw new Error(`La especialidad '${normalizedData.especialidad_medica}' ya está registrada`);
            }
            return TipoCitaRepository_1.default.create(normalizedData);
        });
    }
    actualizarTipoCita(id, tipoCitaData) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipoCita = yield TipoCitaRepository_1.default.findByPk(id);
            if (!tipoCita)
                throw new Error('Tipo de cita no encontrado');
            return TipoCitaRepository_1.default.update(id, tipoCitaData);
        });
    }
    eliminarTipoCita(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipoCita = yield TipoCitaRepository_1.default.desactivar(id);
            if (!tipoCita)
                throw new Error('Tipo de cita no encontrado');
            if (tipoCita.especialidad_medica) {
                yield this.eliminarHorariosPorEspecialidad(tipoCita.especialidad_medica);
            }
            return tipoCita;
        });
    }
    eliminarHorariosPorEspecialidad(especialidad) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. Desactivar médicos
                yield medico_1.default.update({ estado: 'inactivo' }, { where: { especialidad_medica: especialidad } });
                // 2. Actualizar citas
                yield cita_medica_1.default.update({ estado_actividad: 'inactivo' }, {
                    where: {
                        rut_medico: {
                            [sequelize_1.Op.in]: sequelize_1.Sequelize.literal(`(SELECT rut FROM medicos WHERE especialidad_medica = '${especialidad}')`)
                        },
                        estado: { [sequelize_1.Op.in]: ['terminado', 'no_pagado', 'no_asistio'] }
                    }
                });
                // 3. Eliminar horarios
                const horarios = yield horario_medico_1.default.findAll({
                    attributes: ['idHorario'],
                    include: [{
                            model: medico_1.default,
                            as: 'medico',
                            where: { especialidad_medica: especialidad }
                        }]
                });
                const ids = horarios.map(h => h.idHorario);
                if (ids.length > 0) {
                    yield horario_medico_1.default.destroy({
                        where: {
                            idHorario: {
                                [sequelize_1.Op.in]: ids
                            }
                        }
                    });
                }
            }
            catch (error) {
                console.error("Error eliminando horarios por especialidad", error);
                throw new Error('Error al desactivar elementos relacionados');
            }
        });
    }
    normalizarEspecialidad(especialidad) {
        return especialidad
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }
}
exports.TipoCitaService = TipoCitaService;
exports.default = new TipoCitaService();
//# sourceMappingURL=tipocita.service.js.map