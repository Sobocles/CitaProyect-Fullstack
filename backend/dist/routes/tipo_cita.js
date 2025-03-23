"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const tipo_cita_1 = __importDefault(require("../controllers/tipo_cita"));
const router = (0, express_1.Router)();
router.get('/especialidades', tipo_cita_1.default.instance.getEspecialidades);
router.get('/', [
    validar_campos_1.default.instance.validarCampos
], tipo_cita_1.default.instance.getTipoCitas);
router.get('/:id', [
    validar_campos_1.default.instance.validarCampos
], tipo_cita_1.default.instance.getTipoCita);
router.post('/', [
    validar_campos_1.default.instance.validarCampos
], tipo_cita_1.default.instance.crearTipoCita);
router.put('/:id', [
    validar_campos_1.default.instance.validarCampos
], tipo_cita_1.default.instance.putTipoCita);
router.delete('/:id', [
    validar_campos_1.default.instance.validarCampos
], tipo_cita_1.default.instance.deleteTipoCita);
exports.default = router;
//# sourceMappingURL=tipo_cita.js.map