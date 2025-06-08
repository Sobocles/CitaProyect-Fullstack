import { Router } from 'express';
import { horarioMedicoController } from '../controllers/HorarioMedicoController';
import validarCampos from '../middlewares/validar-campos';

const router = Router();

router.get('/', [
    validarCampos.instance.validarCampos,
], horarioMedicoController.getHorariosMedicos);

router.get('/:id', [
    validarCampos.instance.validarCampos
], horarioMedicoController.getHorarioMedico);

router.post(
    '/',
    [
        // Aquí puedes agregar validaciones si las necesitas
        validarCampos.instance.validarCampos
    ], 
    horarioMedicoController.crearHorarioMedico
);

router.put('/:id', [
    validarCampos.instance.validarCampos
], horarioMedicoController.putHorarioMedico);

router.delete('/:id', [
    validarCampos.instance.validarCampos
], horarioMedicoController.deleteHorarioMedico);

export default router;