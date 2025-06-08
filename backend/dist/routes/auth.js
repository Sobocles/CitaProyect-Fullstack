"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// BACKEND/routes/auth.ts
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../controllers/auth"));
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const validar_jwt_1 = __importDefault(require("../middlewares/validar-jwt"));
const router = (0, express_1.Router)();
// Ruta para el login
router.post('/', [
    (0, express_validator_1.check)('email', 'El correo es obligatorio').isEmail(),
    (0, express_validator_1.check)('password', 'La contraseña es obligatoria').not().isEmpty(),
    validar_campos_1.default.instance.validarCampos
], auth_1.default.instance.login);
// Ruta para el registro de usuarios (añadida)
router.post('/registro', [
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    (0, express_validator_1.check)('email', 'El correo es obligatorio').isEmail(),
    (0, express_validator_1.check)('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    (0, express_validator_1.check)('telefono', 'El teléfono es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('direccion', 'La dirección es obligatoria').not().isEmpty(),
    validar_campos_1.default.instance.validarCampos
], auth_1.default.instance.registro);
// Ruta para revalidar el token
router.post('/revalidarToken', [
    validar_jwt_1.default.instance.validarJwt
], auth_1.default.instance.revalidarToken);
// Ruta para recuperar contraseña
router.post('/RecuperarPassword', [
    validar_campos_1.default.instance.validarCampos
], auth_1.default.instance.recuperarPassword);
exports.default = router;
//# sourceMappingURL=auth.js.map