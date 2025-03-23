
import { Router } from 'express';

import { getDocumentosColeccion, getTodo} from '../controllers/busquedas';
import ValidarJwt from '../middlewares/validar-jwt';


const router = Router();


router.get('/:busqueda', 

getTodo );


router.get('/coleccion/:tabla/:busqueda', 
 getDocumentosColeccion );


export default router;