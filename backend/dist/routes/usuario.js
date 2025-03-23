"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const usuario_1 = require("../controllers/usuario");
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const router = (0, express_1.Router)();
router.get('/', usuario_1.getUsuarios);
router.get('/all', usuario_1.getAllUsuarios);
router.get('/allCurso/:rut_medico', usuario_1.getPacientesConCitasPagadasYEnCurso);
router.get('/allCursoTerminado/:rut_medico', usuario_1.getPacientesConCitasPagadasYEnCursoYterminado);
router.get('/:id', usuario_1.getUsuario);
router.post('/', [
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    (0, express_validator_1.check)('email', 'El correo es obligatorio').isEmail(),
    (0, express_validator_1.check)('telefono', 'El teléfono es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('direccion', 'La dirección es obligatoria').not().isEmpty(),
    validar_campos_1.default.instance.validarCampos
], usuario_1.CrearUsuario);
router.put('/:id', [], usuario_1.putUsuario);
router.delete('/:rut', usuario_1.deleteUsuario);
router.post('/cambiarPassword', [
    (0, express_validator_1.check)('newPassword', 'El nuevo password es obligatorio').isLength({ min: 6 }),
    (0, express_validator_1.check)('password', 'El password es obligatorio').isLength({ min: 6 }),
], usuario_1.cambiarPassword);
exports.default = router;
//# sourceMappingURL=usuario.js.map