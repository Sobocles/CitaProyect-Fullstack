"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class Medico extends sequelize_1.Model {
}
Medico.init({
    rut: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    apellidos: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    telefono: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    direccion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    foto: {
        type: sequelize_1.DataTypes.STRING,
    },
    nacionalidad: {
        type: sequelize_1.DataTypes.STRING,
    },
    especialidad_medica: {
        type: sequelize_1.DataTypes.STRING,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    rol: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'MEDICO_ROLE',
    },
    estado: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: 'activo' // Valor por defecto es 'activo'
    },
}, {
    sequelize: connection_1.default,
    modelName: 'Medico',
    tableName: 'medicos' // Nombre real de la tabla en la base de datos
});
// Definir la relación con CitaMedica
exports.default = Medico;
/*
import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';
import CitaMedica from './cita_medica';

class Medico extends Model {
  public rut!: string;
  public nombre!: string;
  public apellidos!: string;
  public email!: string;
  public telefono!: string;
  public direccion!: string;
  public foto!: string;
  public nacionalidad!: string;
  public especialidad_medica!: string;
  public password!: string; // Nueva propiedad para contraseña
  public rol!: string;      // Nueva propiedad para el rol
}

Medico.init(
  {
    rut: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foto: {
      type: DataTypes.STRING,
    },
    nacionalidad: {
      type: DataTypes.STRING,
    },
    especialidad_medica: {
      type: DataTypes.STRING,
    },
    password: {  // Nueva definición para contraseña
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {  // Nueva definición para rol
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'MEDICO_ROLE', // Esto garantiza que, por defecto, el rol sea 'MEDICO'
    }
  },
  {
    sequelize: db, // Conecta el modelo a tu instancia de Sequelize
    modelName: 'Medico', // Nombre de la tabla en la base de datos
    tableName: 'medicos' // Nombre real de la tabla en la base de datos
  }
);

// Definir la relación con CitaMedica

export default Medico;

*/
//# sourceMappingURL=medico.js.map