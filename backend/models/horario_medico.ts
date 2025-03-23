import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';

interface HorarioMedicAttributes {
  idHorario?: number;
  diaSemana: string;
  horaInicio: string;
  horaFinalizacion: string;
  inicio_colacion: string; // Nuevo campo agregado
  fin_colacion: string;    // Nuevo campo agregado
  rut_medico: string;
  disponibilidad?: boolean;
  fechaCreacion?: Date;
}

class HorarioMedic extends Model<HorarioMedicAttributes> implements HorarioMedicAttributes {
  public idHorario!: number;
  public diaSemana!: string;
  public horaInicio!: string;
  public horaFinalizacion!: string;
  public inicio_colacion!: string; // Nuevo campo agregado
  public fin_colacion!: string;    // Nuevo campo agregado
  public rut_medico!: string;
  public disponibilidad?: boolean;
  public fechaCreacion?: Date;
}

HorarioMedic.init(
  {
    idHorario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    diaSemana: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    horaInicio: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    horaFinalizacion: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    inicio_colacion: {
      type: DataTypes.TIME, // Asumiendo que el formato de tiempo es adecuado
      allowNull: true,     // Puede cambiar a false si es un campo requerido
    },
    fin_colacion: {
      type: DataTypes.TIME, // Asumiendo que el formato de tiempo es adecuado
      allowNull: true,     // Puede cambiar a false si es un campo requerido
    },
    rut_medico: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disponibilidad: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db,
    modelName: 'HorarioMedic',
    tableName: 'horarioMedicos'
  }
);

export default HorarioMedic;
