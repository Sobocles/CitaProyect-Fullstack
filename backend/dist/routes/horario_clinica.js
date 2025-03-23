"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const horario_clinica_1 = __importDefault(require("../controllers/horario_clinica"));
const router = (0, express_1.Router)();
router.get('/', [
    validar_campos_1.default.instance.validarCampos
], horario_clinica_1.default.instance.obtenerHorariosClinica);
router.get('/porEspecialidad', [
    validar_campos_1.default.instance.validarCampos
], horario_clinica_1.default.instance.obtenerEspecialidadesPorDia);
router.get('/Infoclinica', [
    validar_campos_1.default.instance.validarCampos
], horario_clinica_1.default.instance.getInfoClinica);
router.delete('/Infoclinica/:id', [
    validar_campos_1.default.instance.validarCampos
], horario_clinica_1.default.instance.deleteInfoClinica);
router.get('/:id', [
    validar_campos_1.default.instance.validarCampos
], horario_clinica_1.default.instance.getHorarioClinica);
router.post('/', [], horario_clinica_1.default.instance.CrearHorarioClinica);
router.post('/Infoclinica', [], horario_clinica_1.default.instance.crearInfoClinica);
router.put('/:id', [], horario_clinica_1.default.instance.putHorarioClinica);
router.delete('/:id', [], horario_clinica_1.default.instance.deleteHorarioClinica);
exports.default = router;
//# sourceMappingURL=horario_clinica.js.map