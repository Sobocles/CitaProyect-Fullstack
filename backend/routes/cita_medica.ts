import { Router } from 'express';
import CitaMedica from '../controllers/cita_medica';

import validarCampos from '../middlewares/validar-campos';
import ValidarJwt from '../middlewares/validar-jwt';


const router = Router();

router.get('/',[

  
    validarCampos.instance.validarCampos
], CitaMedica.instance.getCitas );



router.get('/:idCita', [
  
    validarCampos.instance.validarCampos
], CitaMedica.instance.getCitaFactura );

router.get('/medico/:rut_medico', [
  
    validarCampos.instance.validarCampos
], CitaMedica.instance.getCitasMedico );

router.get('/usuario/:rut_paciente', [
  
    validarCampos.instance.validarCampos
], CitaMedica.instance.getCitasPaciente );


router.post('/', [
    
    validarCampos.instance.validarCampos
], CitaMedica.instance.crearCita );

router.post('/crearCitapaciente', [
    
    validarCampos.instance.validarCampos
], CitaMedica.instance.crearCitaPaciente );

router.put('/:id',
    [
       
    validarCampos.instance.validarCampos
    ], CitaMedica.instance.putCita
    
 );

router.delete('/:id',[
   
    validarCampos.instance.validarCampos
    ], CitaMedica.instance.deleteCita

 );

 export default router;
