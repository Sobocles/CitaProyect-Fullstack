import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';
import CitaMedica from './cita_medica'; // Asegúrate de que este importe es correcto

class TipoCita extends Model {
  public idTipoCita!: number;
  public tipo_cita!: string;
  public precio!: number;
  public especialidad_medica!: string;
  public duracion_cita!: number;
  public estado!: string; // Nuevo campo agregado
}

TipoCita.init(
  {
    idTipoCita: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo_cita: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    precio: {
      type: DataTypes.FLOAT, 
      allowNull: false,
    },
    especialidad_medica: {
      type: DataTypes.STRING,
    },
    duracion_cita: {
      type: DataTypes.INTEGER, 
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'activo' // Estado por defecto es 'activo'
    },
  },
  {
    sequelize: db,
    modelName: 'TipoCita',
    tableName: 'tipocitas'
  }
);

export default TipoCita;
