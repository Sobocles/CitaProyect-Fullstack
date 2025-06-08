"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const historial_medico_1 = require("../controllers/historial_medico");
const express_validator_1 = require("express-validator");
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const router = (0, express_1.Router)();
router.get('/', [
    validar_campos_1.default.instance.validarCampos,
], historial_medico_1.historialMedicoController.getHistoriales);
router.get('/:id', [
    validar_campos_1.default.instance.validarCampos
], historial_medico_1.historialMedicoController.getHistorial); // Por rut_paciente
router.get('/porIdHistorial/:id', [
    validar_campos_1.default.instance.validarCampos
], historial_medico_1.historialMedicoController.getHistorialPorId); // Por id_historial
router.get('/medico/:id', [
    validar_campos_1.default.instance.validarCampos
], historial_medico_1.historialMedicoController.getHistorialMedico); // Por rut_medico
router.post('/', [
    (0, express_validator_1.check)('diagnostico', 'El diagnóstico es obligatorio').notEmpty(),
    (0, express_validator_1.check)('medicamento', 'El medicamento es obligatorio').notEmpty(),
    (0, express_validator_1.check)('notas', 'Las notas son obligatorias').notEmpty(),
    (0, express_validator_1.check)('rut_paciente', 'El rut del paciente es obligatorio').notEmpty(),
    validar_campos_1.default.instance.validarCampos
], historial_medico_1.historialMedicoController.crearHistorial);
router.put('/:id', [
    validar_campos_1.default.instance.validarCampos
], historial_medico_1.historialMedicoController.putHistorial);
router.delete('/:id', [
    validar_campos_1.default.instance.validarCampos
], historial_medico_1.historialMedicoController.deleteHistorial);
exports.default = router;
//# sourceMappingURL=historial_medico.js.map