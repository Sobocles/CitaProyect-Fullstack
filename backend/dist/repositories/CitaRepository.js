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
exports.CitaRepository = void 0;
const cita_medica_1 = __importDefault(require("../models/cita_medica"));
class CitaRepository {
    findAndCountAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return cita_medica_1.default.findAndCountAll(options);
        });
    }
    findByPk(idCita, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return cita_medica_1.default.findByPk(idCita, options);
        });
    }
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return cita_medica_1.default.findOne(options);
        });
    }
    create(citaData) {
        return __awaiter(this, void 0, void 0, function* () {
            return cita_medica_1.default.create(citaData);
        });
    }
    update(cita, citaData) {
        return __awaiter(this, void 0, void 0, function* () {
            return cita.update(citaData);
        });
    }
    count(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return cita_medica_1.default.count(options);
        });
    }
    updateWhere(where, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return cita_medica_1.default.update(data, { where });
        });
    }
}
exports.CitaRepository = CitaRepository;
exports.default = new CitaRepository();
//# sourceMappingURL=CitaRepository.js.map