import { Router } from 'express';
import { historialMedicoController } from '../controllers/historial_medico';
import { check } from 'express-validator';
import validarCampos from '../middlewares/validar-campos';
import ValidarJwt from '../middlewares/validar-jwt';

const router = Router();

router.get('/', [
    validarCampos.instance.validarCampos,
], historialMedicoController.getHistoriales);

router.get('/:id', [
    validarCampos.instance.validarCampos
], historialMedicoController.getHistorial); // Por rut_paciente

router.get('/porIdHistorial/:id', [
    validarCampos.instance.validarCampos
], historialMedicoController.getHistorialPorId); // Por id_historial

router.get('/medico/:id', [
    validarCampos.instance.validarCampos
], historialMedicoController.getHistorialMedico); // Por rut_medico

router.post(
    '/',
    [
        check('diagnostico', 'El diagnóstico es obligatorio').notEmpty(),
        check('medicamento', 'El medicamento es obligatorio').notEmpty(),
        check('notas', 'Las notas son obligatorias').notEmpty(),
        check('rut_paciente', 'El rut del paciente es obligatorio').notEmpty(),
        validarCampos.instance.validarCampos
    ],
    historialMedicoController.crearHistorial
);

router.put('/:id', [
    validarCampos.instance.validarCampos
], historialMedicoController.putHistorial);

router.delete('/:id', [
    validarCampos.instance.validarCampos
], historialMedicoController.deleteHistorial);

export default router;