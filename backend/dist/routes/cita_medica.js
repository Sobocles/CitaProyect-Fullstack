"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cita_medica_1 = __importDefault(require("../controllers/cita_medica"));
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const router = (0, express_1.Router)();
router.get('/', [
    validar_campos_1.default.instance.validarCampos
], cita_medica_1.default.instance.getCitas);
router.get('/:idCita', [
    validar_campos_1.default.instance.validarCampos
], cita_medica_1.default.instance.getCitaFactura);
router.get('/medico/:rut_medico', [
    validar_campos_1.default.instance.validarCampos
], cita_medica_1.default.instance.getCitasMedico);
router.get('/usuario/:rut_paciente', [
    validar_campos_1.default.instance.validarCampos
], cita_medica_1.default.instance.getCitasPaciente);
router.post('/', [
    validar_campos_1.default.instance.validarCampos
], cita_medica_1.default.instance.crearCita);
router.post('/crearCitapaciente', [
    validar_campos_1.default.instance.validarCampos
], cita_medica_1.default.instance.crearCitaPaciente);
router.put('/:id', [
    validar_campos_1.default.instance.validarCampos
], cita_medica_1.default.instance.putCita);
router.delete('/:id', [
    validar_campos_1.default.instance.validarCampos
], cita_medica_1.default.instance.deleteCita);
exports.default = router;
//# sourceMappingURL=cita_medica.js.map