"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipo_cita_1 = require("../controllers/tipo_cita");
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const router = (0, express_1.Router)();
// Rutas para especialidades
router.get('/especialidades/all', tipo_cita_1.tipoCitaController.getAllEspecialidades);
router.get('/especialidades', tipo_cita_1.tipoCitaController.getEspecialidades); // Corregido a getEspecialidades
// Rutas CRUD para tipos de cita
router.get('/', [
    validar_campos_1.default.instance.validarCampos
], tipo_cita_1.tipoCitaController.getTipoCitas);
router.get('/:id', [
    validar_campos_1.default.instance.validarCampos
], tipo_cita_1.tipoCitaController.getTipoCita);
router.post('/', [
    validar_campos_1.default.instance.validarCampos
], tipo_cita_1.tipoCitaController.crearTipoCita);
router.put('/:id', [
    validar_campos_1.default.instance.validarCampos
], tipo_cita_1.tipoCitaController.putTipoCita);
router.delete('/:id', [
    validar_campos_1.default.instance.validarCampos
], tipo_cita_1.tipoCitaController.deleteTipoCita);
exports.default = router;
//# sourceMappingURL=tipo_cita.js.map