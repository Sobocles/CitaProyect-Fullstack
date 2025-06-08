"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const HorarioMedicoController_1 = require("../controllers/HorarioMedicoController");
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const router = (0, express_1.Router)();
router.get('/', [
    validar_campos_1.default.instance.validarCampos,
], HorarioMedicoController_1.horarioMedicoController.getHorariosMedicos);
router.get('/:id', [
    validar_campos_1.default.instance.validarCampos
], HorarioMedicoController_1.horarioMedicoController.getHorarioMedico);
router.post('/', [
    // Aquí puedes agregar validaciones si las necesitas
    validar_campos_1.default.instance.validarCampos
], HorarioMedicoController_1.horarioMedicoController.crearHorarioMedico);
router.put('/:id', [
    validar_campos_1.default.instance.validarCampos
], HorarioMedicoController_1.horarioMedicoController.putHorarioMedico);
router.delete('/:id', [
    validar_campos_1.default.instance.validarCampos
], HorarioMedicoController_1.horarioMedicoController.deleteHorarioMedico);
exports.default = router;
//# sourceMappingURL=horario_medico.js.map