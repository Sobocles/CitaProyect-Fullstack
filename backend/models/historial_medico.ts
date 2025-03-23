import { DataTypes, Model } from 'sequelize';
import db from '../db/connection'; // Asegúrate de importar tu conexión a la base de datos
import Paciente from '../models/usuario'; // Importa el modelo de paciente
import Medico from './medico';

class HistorialMedico extends Model {
    public id_historial!: number;
    public diagnostico!: string;
    public medicamento!: string;
    public notas!: string;
    public fecha_consulta!: Date;
    public archivo!: string;
    public rut_paciente!: string; // Clave foranea a la tabla paciente
    public rut_medico!: string;
    public estado!: string; // Nuevo campo agregado
}

// Define el modelo para el historial médico
HistorialMedico.init(
    {
        id_historial: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        diagnostico: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        medicamento: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        notas: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fecha_consulta: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        archivo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        rut_paciente: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: Paciente, // Referencia al modelo Paciente
                key: 'rut'
            }
        },
        rut_medico: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: Medico,   // Referencia al modelo Medico
                key: 'rut'
            }
        },
        estado: { // Campo de estado agregado
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'activo' // Valor por defecto es 'activo'
        },
    },
    {
        sequelize: db, // Conecta el modelo a tu instancia de Sequelize
        modelName: 'HistorialMedico', // Nombre de la tabla en la base de datos
    }
);

export default HistorialMedico;
