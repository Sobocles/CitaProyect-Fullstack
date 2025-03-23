"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const medico_1 = __importDefault(require("../controllers/medico"));
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.get('/', [
    validar_campos_1.default.instance.validarCampos
], medico_1.default.instance.getMedicos);
router.get('/Especialidades', [
    validar_campos_1.default.instance.validarCampos
], medico_1.default.instance.getMedicosEspecialidad);
router.get('/all', [
    validar_campos_1.default.instance.validarCampos
], medico_1.default.instance.getAllMedicos);
router.get('/:id', [
    validar_campos_1.default.instance.validarCampos
], medico_1.default.instance.getMedico);
router.post('/', [
    // Agrega las validaciones para cada campo del médico aquí
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    (0, express_validator_1.check)('email', 'El email es obligatorio').isEmail(),
    (0, express_validator_1.check)('direccion', 'La dirección es obligatoria').not().isEmpty(),
    // Agrega más validaciones según tus necesidades
], medico_1.default.instance.CrearMedico);
router.post('/cambiarPassword', [], medico_1.default.instance.cambiarPasswordMedico);
router.put('/:rut', [], medico_1.default.instance.putMedico);
router.delete('/:rut', [
    validar_campos_1.default.instance.validarCampos
], medico_1.default.instance.deleteMedico);
exports.default = router;
//# sourceMappingURL=medico.js.map