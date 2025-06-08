// BACKEND/routes/auth.ts
import { Router } from 'express';
import { check } from 'express-validator';
import Auth from '../controllers/auth';
import validarCampos from '../middlewares/validar-campos';
import ValidarJwt from '../middlewares/validar-jwt';

const router = Router();

// Ruta para el login
router.post('/', [
  check('email', 'El correo es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  validarCampos.instance.validarCampos
], Auth.instance.login);

// Ruta para el registro de usuarios (añadida)
router.post('/registro', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
  check('email', 'El correo es obligatorio').isEmail(),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  check('telefono', 'El teléfono es obligatorio').not().isEmpty(),
  check('direccion', 'La dirección es obligatoria').not().isEmpty(),
  validarCampos.instance.validarCampos
], Auth.instance.registro);

// Ruta para revalidar el token
router.post('/revalidarToken', [
  ValidarJwt.instance.validarJwt
], Auth.instance.revalidarToken);

// Ruta para recuperar contraseña
router.post('/RecuperarPassword', [
  validarCampos.instance.validarCampos
], Auth.instance.recuperarPassword);

export default router;
