
import { Router } from 'express';
import validarCampos from '../middlewares/validar-campos';
import tipo_cita from '../controllers/tipo_cita';
import ValidarJwt from '../middlewares/validar-jwt';

const router = Router();

router.get('/especialidades',
tipo_cita.instance.getEspecialidades);

router.get('/',[

    
    validarCampos.instance.validarCampos
], tipo_cita.instance.getTipoCitas );

router.get('/:id', [
    
    validarCampos.instance.validarCampos
],tipo_cita.instance.getTipoCita  );


router.post(
    '/',
    [
        
        validarCampos.instance.validarCampos
    ], tipo_cita.instance.crearTipoCita
    
  );

router.put('/:id',
    [
        
    
    validarCampos.instance.validarCampos
    ], tipo_cita.instance.putTipoCita

 );

router.delete('/:id',[
   
    validarCampos.instance.validarCampos
], tipo_cita.instance.deleteTipoCita
 );




export default router;
