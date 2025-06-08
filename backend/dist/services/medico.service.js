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
const medico_repository_1 = __importDefault(require("../repositories/medico.repository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const rol_1 = __importDefault(require("../models/rol"));
const enums_1 = require("../types/enums");
const auth_service_1 = __importDefault(require("./auth.service"));
class MedicoService {
    getPaginatedMedicos(desde) {
        return __awaiter(this, void 0, void 0, function* () {
            const [total, medicos] = yield Promise.all([
                medico_repository_1.default.countActiveMedicos(),
                medico_repository_1.default.findActiveMedicos(desde)
            ]);
            return { total, medicos };
        });
    }
    getAllMedicos() {
        return __awaiter(this, void 0, void 0, function* () {
            const medicos = yield medico_repository_1.default.findAllActiveMedicos();
            const total = medicos.length;
            // Procesar para asignar el rol como string
            const medicosProcesados = medicos.map(medico => {
                const medicoJSON = medico.toJSON();
                if (medicoJSON.rol && medicoJSON.rol.codigo) {
                    medicoJSON.rol = medicoJSON.rol.codigo;
                }
                return medicoJSON;
            });
            return { total, medicos: medicosProcesados };
        });
    }
    getMedicosByEspecialidad() {
        return __awaiter(this, void 0, void 0, function* () {
            return medico_repository_1.default.findMedicosByValidEspecialidades();
        });
    }
    getMedicoById(rut) {
        return __awaiter(this, void 0, void 0, function* () {
            const medico = yield medico_repository_1.default.findById(rut);
            if (!medico)
                return null;
            // Procesar para asignar el rol como string
            const medicoJSON = medico.toJSON();
            if (medicoJSON.rol && medicoJSON.rol.codigo) {
                medicoJSON.rol = medicoJSON.rol.codigo;
            }
            return medicoJSON;
        });
    }
    createMedico(medicoData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, rut, telefono, rol: rolCodigo, password } = medicoData;
            // Validar email único
            if (yield auth_service_1.default.instance.verificarEmailExistente(email)) {
                throw new Error('El correo ya está registrado');
            }
            // Validar RUT único
            const existeRut = yield medico_repository_1.default.findById(rut);
            if (existeRut) {
                throw new Error('El RUT ya está registrado');
            }
            // Validar teléfono único
            if (yield auth_service_1.default.instance.verificarTelefonoExistente(telefono)) {
                throw new Error('El teléfono ya está registrado');
            }
            // Obtener ID del rol
            let rolId = 3; // MEDICO_ROLE por defecto
            if (rolCodigo) {
                const rol = yield rol_1.default.findOne({ where: { codigo: rolCodigo } });
                if (rol)
                    rolId = rol.id;
            }
            else {
                const rolMedico = yield rol_1.default.findOne({ where: { codigo: enums_1.UserRole.MEDICO } });
                if (rolMedico)
                    rolId = rolMedico.id;
            }
            // Encriptar contraseña
            const saltRounds = 10;
            const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
            // Crear médico
            return medico_repository_1.default.createMedico(Object.assign(Object.assign({}, medicoData), { password: hashedPassword, rolId }));
        });
    }
    updateMedico(rut, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (updateData.rol) {
                const rol = yield rol_1.default.findOne({ where: { codigo: updateData.rol } });
                if (rol) {
                    updateData.rolId = rol.id;
                }
                delete updateData.rol;
            }
            return medico_repository_1.default.updateMedico(rut, updateData);
        });
    }
    deleteMedico(rut) {
        return __awaiter(this, void 0, void 0, function* () {
            return medico_repository_1.default.deleteMedico(rut);
        });
    }
    changePassword(rut, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const medico = yield medico_repository_1.default.findById(rut);
            if (!medico)
                throw new Error('Médico no encontrado');
            // Validar contraseña actual
            const validPassword = bcrypt_1.default.compareSync(currentPassword, medico.password);
            if (!validPassword)
                throw new Error('Contraseña actual incorrecta');
            // Validar nueva contraseña
            const samePassword = bcrypt_1.default.compareSync(newPassword, medico.password);
            if (samePassword)
                throw new Error('La nueva contraseña no puede ser igual a la actual');
            // Encriptar y actualizar
            const salt = bcrypt_1.default.genSaltSync();
            const hashedPassword = bcrypt_1.default.hashSync(newPassword, salt);
            return medico_repository_1.default.changePassword(rut, hashedPassword);
        });
    }
}
exports.default = new MedicoService();
//# sourceMappingURL=medico.service.js.map