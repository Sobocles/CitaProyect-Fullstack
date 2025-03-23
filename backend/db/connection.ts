import { Sequelize } from 'sequelize';

const db = new Sequelize('gestor', 'root', 'puppetmaster', { 
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});



// Sincronizar modelos con la base de datos
export const syncDatabase = async () => {
    try {
        await db.sync({ force: false }); // Usar {force: true} solo en desarrollo, elimina tablas existentes
        console.log('Tablas sincronizadas correctamente');
    } catch (error) {
        console.error('Error al sincronizar tablas:', error);
    }
};

export default db;