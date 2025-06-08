import dotenv from 'dotenv';
import Server from './models/server';
require('./models/associations');
import { syncDatabase } from './db/connection';
import { initializeData } from './db/initializer';

dotenv.config();
const server = new Server();

// Secuencia de inicio de la aplicación
async function startApp() {
  try {
    // 1. Sincronizar base de datos
    await syncDatabase();
    console.log('Base de datos sincronizada correctamente');
    
    // 2. Inicializar datos básicos (roles, etc.)
    await initializeData();
    
    // 3. Iniciar el servidor
    server.listen();
  } catch (err) {
    console.error('Error al iniciar la aplicación:', err);
    process.exit(1); // Terminar proceso con error
  }
}

// Iniciar la aplicación
startApp();