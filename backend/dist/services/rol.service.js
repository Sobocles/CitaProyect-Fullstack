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
// services/rol.service.ts
const rol_1 = __importDefault(require("../models/rol"));
const enums_1 = require("../types/enums");
const menu_frontend_1 = require("../helpers/menu-frontend");
/**
 * Servicio para la gestión de roles en el sistema
 */
class RolService {
    static get instance() {
        return this._instance || (this._instance = new RolService());
    }
    constructor() { }
    /**
     * Verifica si un rol existe en la base de datos
     * @param codigo Código del rol a verificar
     * @returns true si existe, false si no
     */
    rolExiste(codigo) {
        return __awaiter(this, void 0, void 0, function* () {
            const rol = yield rol_1.default.findOne({ where: { codigo, estado: 'activo' } });
            return !!rol;
        });
    }
    /**
     * Obtiene todos los roles activos
     * @returns Lista de roles activos
     */
    obtenerRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield rol_1.default.findAll({ where: { estado: 'activo' } });
        });
    }
    /**
     * Obtiene un rol por su código
     * @param codigo Código del rol
     * @returns Rol encontrado o null
     */
    obtenerRolPorCodigo(codigo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield rol_1.default.findOne({ where: { codigo, estado: 'activo' } });
        });
    }
    /**
     * Verifica si un rol es válido según los roles del sistema
     * @param rolCodigo Código del rol a validar
     * @returns true si es válido, false si no
     */
    esRolValido(rolCodigo) {
        return __awaiter(this, void 0, void 0, function* () {
            // Si es uno de los roles predefinidos, es válido
            if (Object.values(enums_1.UserRole).includes(rolCodigo)) {
                return true;
            }
            // Si no, verificar en la base de datos
            return yield this.rolExiste(rolCodigo);
        });
    }
    /**
     * Obtiene los roles que puede asignar un usuario según su propio rol
     * @param rolActual Rol actual del usuario
     * @returns Array de códigos de roles que puede asignar
     */
    obtenerRolesPermitidos(rolActual) {
        return __awaiter(this, void 0, void 0, function* () {
            // Por defecto, nadie puede asignar roles
            let rolesPermitidos = [];
            switch (rolActual) {
                case enums_1.UserRole.ADMIN:
                    // Un administrador puede asignar cualquier rol
                    const todosRoles = yield this.obtenerRoles();
                    rolesPermitidos = todosRoles.map(rol => rol.codigo);
                    break;
                case enums_1.UserRole.MEDICO:
                    // Un médico solo puede asignar rol de paciente
                    rolesPermitidos = [enums_1.UserRole.USER];
                    break;
                // Otros roles no pueden asignar roles
                default:
                    break;
            }
            return rolesPermitidos;
        });
    }
    /**
     * Obtiene el menú correspondiente al rol del usuario
     * @param rol Rol del usuario
     * @returns Menú disponible para el rol
     */
    getMenuByRol(rol) {
        return (0, menu_frontend_1.getMenuFrontEnd)(rol);
    }
}
exports.default = RolService;
//# sourceMappingURL=rol.service.js.map