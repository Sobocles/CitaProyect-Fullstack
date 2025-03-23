// Define el modelo de HorarioLaboral
import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';


class HorarioClinica extends Model {
  public dia!: string; // Día de la semana (por ejemplo, 'lunes', 'martes', etc.)
  public horaInicio!: string;
  public horaFin!: string;
  public medicoId!: string; // Referencia al médico
}

HorarioClinica.init(
  {
    dia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    horaInicio: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    horaFin: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    rut_medico: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'HorarioClinica',
    tableName: 'horarios_clinica',
  }
);

export default HorarioClinica;
