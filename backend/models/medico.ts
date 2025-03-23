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
  public estado!: string;
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
    password: {  
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {  
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'MEDICO_ROLE', 
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'activo' // Valor por defecto es 'activo'
  },
  },
  {
    sequelize: db, // Conecta el modelo a tu instancia de Sequelize
    modelName: 'Medico', // Nombre de la tabla en la base de datos
    tableName: 'medicos' // Nombre real de la tabla en la base de datos
  }
);

// Definir la relación con CitaMedica

export default Medico;

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
