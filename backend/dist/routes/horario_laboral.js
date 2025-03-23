"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const router = (0, express_1.Router)();
router.get('/', [
    validar_campos_1.default.instance.validarCampos
]);
router.get('/:id', [
    validar_campos_1.default.instance.validarCampos
]);
router.post('/', [
// Puedes agregar más validaciones según tus necesidades
]);
router.put('/:id', [
    validar_campos_1.default.instance.validarCampos
]);
router.delete('/:id', [
    validar_campos_1.default.instance.validarCampos
]);
exports.default = router;
//# sourceMappingURL=horario_laboral.js.map