import { Router } from 'express';
import Historial_Medico from '../controllers/historial_medico';

import { check } from 'express-validator';
import validarCampos from '../middlewares/validar-campos';
import ValidarJwt from '../middlewares/validar-jwt';


const router = Router();

router.get('/',[

  
    validarCampos.instance.validarCampos,
], Historial_Medico.instance.getHistoriales);

router.get('/:id', [
  
    validarCampos.instance.validarCampos
], Historial_Medico.instance.getHistorial);

router.get('/porIdHistorial/:id', [
  
  validarCampos.instance.validarCampos
], Historial_Medico.instance.getHistorialPorId);

router.get('/medico/:id', [
  
  validarCampos.instance.validarCampos
], Historial_Medico.instance.getHistorialMedico);


router.post(
    '/',
    [
    
      check('diagnostico', 'El diagnóstico es obligatorio').notEmpty(),
      check('medicamento', 'El medicamento es obligatorio').notEmpty(),
      check('notas', 'Las notas son obligatorias').notEmpty(),
      check('rut_paciente', 'El rut del paciente es obligatorio').notEmpty(),

      // Puedes agregar más validaciones según tus necesidades
    ],
    Historial_Medico.instance.CrearHistorial
  );

router.put('/:id',
    [
     
    validarCampos.instance.validarCampos
    ], 
    Historial_Medico.instance.putHistorial
 );

router.delete('/:id',[

    validarCampos.instance.validarCampos
], 
Historial_Medico.instance.deleteHistorial
 );

 export default router;
