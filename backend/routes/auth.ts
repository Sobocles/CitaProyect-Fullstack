const { Router } = require('express');
import { check } from 'express-validator';
import Usuarios from '../controllers/auth';
import validarCampos from '../middlewares/validar-campos';
import ValidarJwt from '../middlewares/validar-jwt';

const router = Router();

router.post('/',[
   
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos.instance.validarCampos
],Usuarios.instance.login);

router.post('/revalidarToken', [
    ValidarJwt.instance.validarJwt
] ,Usuarios.instance.revalidarToken);


router.post('/RecuperarPassword',[
    
    validarCampos.instance.validarCampos
], Usuarios.instance.recuperarPassword);

export default router;
