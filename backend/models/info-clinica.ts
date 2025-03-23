import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';

class InfoClinica extends Model {
    public id!: number; // Agrega esta línea
    public nombreClinica!: string;
    public direccion!: string;
    public telefono!: string;
    public email!: string;
}

InfoClinica.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Asegúrate de que se autoincremente
    },
    nombreClinica: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion: {
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
    }
  },
  {
    sequelize: db,
    modelName: 'InfoClinica',
    tableName: 'infoclinica'
  }
);

export default InfoClinica;
