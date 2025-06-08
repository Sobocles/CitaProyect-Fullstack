import { Router } from 'express';
import { tipoCitaController } from '../controllers/tipo_cita';
import validarCampos from '../middlewares/validar-campos';

const router = Router();

// Rutas para especialidades
router.get('/especialidades/all', tipoCitaController.getAllEspecialidades);
router.get('/especialidades', tipoCitaController.getEspecialidades);  // Corregido a getEspecialidades

// Rutas CRUD para tipos de cita
router.get('/', [
  validarCampos.instance.validarCampos
], tipoCitaController.getTipoCitas);

router.get('/:id', [
  validarCampos.instance.validarCampos
], tipoCitaController.getTipoCita);

router.post('/', [
  validarCampos.instance.validarCampos
], tipoCitaController.crearTipoCita);

router.put('/:id', [
  validarCampos.instance.validarCampos
], tipoCitaController.putTipoCita);

router.delete('/:id', [
  validarCampos.instance.validarCampos
], tipoCitaController.deleteTipoCita);

export default router;