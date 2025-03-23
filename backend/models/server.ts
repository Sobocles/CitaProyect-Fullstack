import express, { Application } from 'express';
import userRoutes from '../routes/usuario';
import loginRoutes from '../routes/auth';
import medicoRoutes from '../routes/medico';
import historialRoutes from '../routes/historial_medico'
import horarioRoutes from '../routes/horario_medico'
import citaMedicaRoutes from '../routes/cita_medica'
import tipo_cita from '../routes/tipo_cita'
import busquedaRoute from '../routes/busquedas'
import HorarioClinicaRoutes from '../routes/horario_clinica';
import busqueda_citaRoutes from '../routes/busqueda_cita'
import paypalRoutes from '../routes/payments.routes'
import mercadoPagoRoutes from '../routes/mercadoPago'


const cors = require('cors');
import db from '../db/connection';
import { PORT } from '../global/enviorenment';


class Server {
    private app: Application;
  
    private apiPaths = {
        usuarios: '/api/usuarios',
        login: '/api/login', // Ruta para el login
        medicos: '/api/medicos',
        historial_medico: '/api/historial',
        horario_laboral: '/api/horario_medico',
        cita_medica: '/api/cita_medica',
        tipo_cita: '/api/tipo_cita',
        busqueda: '/api/busqueda',
        horario_clinica: '/api/horario_clinica',
        busqueda_cita: '/api/busqueda_cita',
        paypal: '/api/paypal',
        mercadoPago: '/api/mercadoPago',
     
    };


    constructor() {
        this.app = express();
      
        
        //Metodos iniciales
        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection() {
        try {
            await db.authenticate();
            console.log('Database online');
        } catch (error) {
            throw new Error(String(error));
        }
    }

    middlewares() {
        // CORS
        

        const corsOptions = {
          origin: 'http://localhost:4200', // Reemplaza esto con la URL de tu frontend Angular
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          credentials: true, // Habilita el envío de cookies u otras credenciales si es necesario
        };
        
        this.app.use(cors(corsOptions));

        // Lectura del body
        this.app.use(express.json());

        // Carpeta Pública
        this.app.use(express.static('public'));
    }


    routes() {
        //app.use( '/api/usuarios', require('./routes/usuarios') );
        this.app.use(this.apiPaths.usuarios, userRoutes);
        this.app.use(this.apiPaths.login, loginRoutes)
        this.app.use(this.apiPaths.medicos, medicoRoutes)
        this.app.use(this.apiPaths.historial_medico, historialRoutes)
        this.app.use(this.apiPaths.horario_laboral, horarioRoutes )
        this.app.use(this.apiPaths.cita_medica, citaMedicaRoutes )
        this.app.use(this.apiPaths.tipo_cita, tipo_cita )
        this.app.use(this.apiPaths.busqueda, busquedaRoute )
        this.app.use(this.apiPaths.horario_clinica, HorarioClinicaRoutes  )
        this.app.use(this.apiPaths.busqueda_cita, busqueda_citaRoutes  )
        this.app.use(this.apiPaths.paypal, paypalRoutes  )
        this.app.use(this.apiPaths.mercadoPago, mercadoPagoRoutes  )
    
    }

    listen() {
        this.app.listen( PORT, () => {
            console.log('Servidor corriendo en puerto '+ PORT);
        } )
    }
}

export default Server;