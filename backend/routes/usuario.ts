
import { Router } from 'express';
import { check } from 'express-validator';
import { getUsuario, getUsuarios, CrearUsuario, putUsuario, deleteUsuario, getAllUsuarios, getPacientesConCitasPagadasYEnCurso, cambiarPassword, getPacientesConCitasPagadasYEnCursoYterminado } from '../controllers/usuario'
import validarCampos from '../middlewares/validar-campos';
import ValidarJwt from '../middlewares/validar-jwt';

const router = Router();

router.get('/' ,
getUsuarios );

router.get('/all', 
getAllUsuarios);

router.get('/allCurso/:rut_medico', 
 getPacientesConCitasPagadasYEnCurso);

 router.get('/allCursoTerminado/:rut_medico', 
 getPacientesConCitasPagadasYEnCursoYterminado);

router.get('/:id', 
getUsuario );

router.post(
    '/',   
    [
      
      check('nombre', 'El nombre es obligatorio').not().isEmpty(),
      check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
      check('email', 'El correo es obligatorio').isEmail(),

      check('telefono', 'El teléfono es obligatorio').not().isEmpty(),
      check('direccion', 'La dirección es obligatoria').not().isEmpty(),
      validarCampos.instance.validarCampos
      
    ],
    CrearUsuario
  );

  router.put('/:id', 
  [

  ], 
putUsuario
);

router.delete('/:rut', deleteUsuario );

router.post('/cambiarPassword',[
  check('newPassword', 'El nuevo password es obligatorio').isLength({min:6}),
  check('password', 'El password es obligatorio').isLength({min:6}),
 
], cambiarPassword);

export default router;