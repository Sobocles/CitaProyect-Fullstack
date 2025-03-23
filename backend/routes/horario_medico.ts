import { Router } from 'express';
import HorarioMedico from '../controllers/horario_medico';

import validarCampos from '../middlewares/validar-campos';
import ValidarJwt from '../middlewares/validar-jwt';


const router = Router();

router.get('/',[

   
    validarCampos.instance.validarCampos
],HorarioMedico.instance.getHorariosMedicos );

router.get('/:id', [

  validarCampos.instance.validarCampos
], HorarioMedico.instance.getHorarioMedico );


router.post(
    '/',
    [
  

      // Puedes agregar más validaciones según tus necesidades
    ], HorarioMedico.instance.CrearHorarioMedico
    
  );

router.put('/:id',
    [
     
    validarCampos.instance.validarCampos
    ], HorarioMedico.instance.putHorarioMedico);

router.delete('/:id',[
 
    validarCampos.instance.validarCampos
], HorarioMedico.instance.deleteHorarioMedico );

 export default router;