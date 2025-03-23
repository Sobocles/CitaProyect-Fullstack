"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const horario_medico_1 = __importDefault(require("../controllers/horario_medico"));
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const router = (0, express_1.Router)();
router.get('/', [
    validar_campos_1.default.instance.validarCampos
], horario_medico_1.default.instance.getHorariosMedicos);
router.get('/:id', [
    validar_campos_1.default.instance.validarCampos
], horario_medico_1.default.instance.getHorarioMedico);
router.post('/', [
// Puedes agregar más validaciones según tus necesidades
], horario_medico_1.default.instance.CrearHorarioMedico);
router.put('/:id', [
    validar_campos_1.default.instance.validarCampos
], horario_medico_1.default.instance.putHorarioMedico);
router.delete('/:id', [
    validar_campos_1.default.instance.validarCampos
], horario_medico_1.default.instance.deleteHorarioMedico);
exports.default = router;
//# sourceMappingURL=horario_medico.js.map