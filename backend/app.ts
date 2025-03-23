import dotenv from 'dotenv';
import Server from './models/server';
require('./models/associations')
import { syncDatabase } from './db/connection';

dotenv.config();

const server = new Server();

syncDatabase()
  .then(() => {
    server.listen();
  })
  .catch(err => {
    console.error('Error al iniciar la aplicación:', err);
  });