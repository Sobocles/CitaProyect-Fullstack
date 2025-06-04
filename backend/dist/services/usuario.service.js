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
const usuario_repository_1 = __importDefault(require("../repositories/usuario.repository"));
const auth_service_1 = __importDefault(require("./auth.service"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const rol_1 = __importDefault(require("../models/rol"));
class UsuarioService {
    getPaginatedUsers(desde) {
        return __awaiter(this, void 0, void 0, function* () {
            const [total, usuarios] = yield Promise.all([
                usuario_repository_1.default.countActiveUsers(),
                usuario_repository_1.default.findActiveUsers(desde)
            ]);
            return { total, usuarios };
        });
    }
    getAllPatients() {
        return __awaiter(this, void 0, void 0, function* () {
            return usuario_repository_1.default.findAllPatients();
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, telefono, rol: rolCodigo } = userData;
            // Validaciones
            if (yield auth_service_1.default.instance.verificarEmailExistente(email)) {
                throw new Error('El correo ya está registrado');
            }
            if (yield auth_service_1.default.instance.verificarTelefonoExistente(telefono)) {
                throw new Error('El teléfono ya está registrado');
            }
            // Obtener ID del rol
            let rolId = 2; // USER_ROLE por defecto
            if (rolCodigo) {
                const rol = yield rol_1.default.findOne({ where: { codigo: rolCodigo } });
                if (rol)
                    rolId = rol.id;
            }
            // Crear usuario
            return usuario_repository_1.default.createUser(Object.assign(Object.assign({}, userData), { rolId }));
        });
    }
    updateUser(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (updateData.rol) {
                const rol = yield rol_1.default.findOne({ where: { codigo: updateData.rol } });
                if (rol) {
                    updateData.rolId = rol.id;
                }
                delete updateData.rol;
            }
            return usuario_repository_1.default.updateUser(id, updateData);
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return usuario_repository_1.default.deleteUser(id);
        });
    }
    changePassword(rut, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield usuario_repository_1.default.findById(rut);
            if (!usuario)
                throw new Error('Usuario no encontrado');
            // Validar contraseña actual
            const validPassword = bcrypt_1.default.compareSync(currentPassword, usuario.password);
            if (!validPassword)
                throw new Error('Contraseña actual incorrecta');
            // Validar nueva contraseña
            const samePassword = bcrypt_1.default.compareSync(newPassword, usuario.password);
            if (samePassword)
                throw new Error('La nueva contraseña no puede ser igual a la actual');
            // Encriptar y actualizar
            const salt = bcrypt_1.default.genSaltSync();
            const hashedPassword = bcrypt_1.default.hashSync(newPassword, salt);
            return usuario_repository_1.default.changePassword(rut, hashedPassword);
        });
    }
}
exports.default = new UsuarioService();
//# sourceMappingURL=usuario.service.js.map