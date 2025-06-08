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
exports.TipoCitaRepository = void 0;
// src/repositories/TipoCitaRepository.ts
const sequelize_1 = require("sequelize");
const tipo_cita_1 = __importDefault(require("../models/tipo_cita"));
class TipoCitaRepository {
    findAndCountAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return tipo_cita_1.default.findAndCountAll(options);
        });
    }
    findByPk(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return tipo_cita_1.default.findByPk(id);
        });
    }
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return tipo_cita_1.default.findOne(options);
        });
    }
    create(tipoCitaData) {
        return __awaiter(this, void 0, void 0, function* () {
            return tipo_cita_1.default.create(tipoCitaData);
        });
    }
    update(id, tipoCitaData) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipoCita = yield tipo_cita_1.default.findByPk(id);
            if (!tipoCita)
                return null;
            return tipoCita.update(tipoCitaData);
        });
    }
    desactivar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipoCita = yield tipo_cita_1.default.findByPk(id);
            if (!tipoCita)
                return null;
            return tipoCita.update({ estado: 'inactivo' });
        });
    }
    findActiveEspecialidades() {
        return __awaiter(this, void 0, void 0, function* () {
            return tipo_cita_1.default.findAll({
                attributes: ['especialidad_medica'],
                where: {
                    especialidad_medica: { [sequelize_1.Op.ne]: null },
                    estado: 'activo'
                },
                group: ['especialidad_medica'],
                order: [['especialidad_medica', 'ASC']]
            });
        });
    }
}
exports.TipoCitaRepository = TipoCitaRepository;
exports.default = new TipoCitaRepository();
//# sourceMappingURL=TipoCitaRepository.js.map