import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';
import CitaMedica from './cita_medica';

class Usuario extends Model {
    public rut!: string;
    public nombre!: string;
    public apellidos!: string;
    public email!: string;
    public password!: string;
    public fecha_nacimiento!: string;
    public telefono!: string;
    public direccion!: string;
    public rol!: string;
    public estado!: string; // Nuevo campo agregado
}

Usuario.init(
    {
        rut: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        apellidos: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fecha_nacimiento: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        direccion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rol: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'USER_ROLE',
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'activo' // Estado por defecto es 'activo'
        },
    },
    {
        sequelize: db,
        modelName: 'Usuario',
        tableName: 'usuarios',
    }
);

export default Usuario;
