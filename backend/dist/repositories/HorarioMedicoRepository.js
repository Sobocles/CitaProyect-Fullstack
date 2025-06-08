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
exports.HorarioMedicoRepository = void 0;
const horario_medico_1 = __importDefault(require("../models/horario_medico"));
const sequelize_1 = require("sequelize");
class HorarioMedicoRepository {
    findAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return horario_medico_1.default.findAndCountAll(options);
        });
    }
    findByPk(idHorario, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return horario_medico_1.default.findByPk(idHorario, options);
        });
    }
    create(horarioData) {
        return __awaiter(this, void 0, void 0, function* () {
            return horario_medico_1.default.create(horarioData);
        });
    }
    update(horario, horarioData) {
        return __awaiter(this, void 0, void 0, function* () {
            return horario.update(horarioData);
        });
    }
    destroy(horario) {
        return __awaiter(this, void 0, void 0, function* () {
            return horario.destroy();
        });
    }
    findOverlappingSchedules(rut_medico, diaSemana, horaInicio, horaFinalizacion, excludeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {
                rut_medico,
                diaSemana,
                [sequelize_1.Op.or]: [
                    {
                        horaInicio: {
                            [sequelize_1.Op.lt]: horaFinalizacion,
                            [sequelize_1.Op.ne]: horaFinalizacion
                        },
                        horaFinalizacion: {
                            [sequelize_1.Op.gt]: horaInicio
                        }
                    },
                    {
                        horaInicio: {
                            [sequelize_1.Op.lt]: horaFinalizacion
                        },
                        horaFinalizacion: {
                            [sequelize_1.Op.gt]: horaInicio,
                            [sequelize_1.Op.ne]: horaInicio
                        }
                    }
                ]
            };
            if (excludeId) {
                where.idHorario = { [sequelize_1.Op.ne]: excludeId };
            }
            return horario_medico_1.default.findAll({ where });
        });
    }
}
exports.HorarioMedicoRepository = HorarioMedicoRepository;
exports.default = new HorarioMedicoRepository();
//# sourceMappingURL=HorarioMedicoRepository.js.map