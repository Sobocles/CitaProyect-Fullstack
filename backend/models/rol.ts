// BACKEND/models/rol.ts
import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';

class Rol extends Model {
  public id!: number;
  public nombre!: string;
  public codigo!: string;
  public descripcion!: string;
  public estado!: string;
}

Rol.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'activo',
    }
  },
  {
    sequelize: db,
    modelName: 'Rol',
    tableName: 'roles',
  }
);

export default Rol;