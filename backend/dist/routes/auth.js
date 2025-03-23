"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Router } = require('express');
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../controllers/auth"));
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const validar_jwt_1 = __importDefault(require("../middlewares/validar-jwt"));
const router = Router();
router.post('/', [
    (0, express_validator_1.check)('email', 'El correo es obligatorio').isEmail(),
    (0, express_validator_1.check)('password', 'La contraseña es obligatoria').not().isEmpty(),
    validar_campos_1.default.instance.validarCampos
], auth_1.default.instance.login);
router.post('/revalidarToken', [
    validar_jwt_1.default.instance.validarJwt
], auth_1.default.instance.revalidarToken);
router.post('/RecuperarPassword', [
    validar_campos_1.default.instance.validarCampos
], auth_1.default.instance.recuperarPassword);
exports.default = router;
//# sourceMappingURL=auth.js.map