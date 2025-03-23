import Usuario from './usuario';
import TipoCita from './tipo_cita';
import CitaMedica from './cita_medica';
import Medico from './medico';
import HorarioMedic from './horario_medico';
import HistorialMedico from './historial_medico';
import Factura from './factura';

// Asociaciones para Usuario
Usuario.hasMany(CitaMedica, { foreignKey: 'rut_paciente', sourceKey: 'rut', onDelete: 'CASCADE' });
Usuario.hasMany(HistorialMedico, { foreignKey: 'rut_paciente', sourceKey: 'rut', onDelete: 'CASCADE' });

TipoCita.hasOne(CitaMedica, { foreignKey: 'idTipoCita', sourceKey: 'idTipoCita', onDelete: 'CASCADE' });


// Asociaciones para CitaMedica
CitaMedica.belongsTo(Usuario, { foreignKey: 'rut_paciente', targetKey: 'rut', as: 'paciente', onDelete: 'CASCADE' });
CitaMedica.belongsTo(Medico, { foreignKey: 'rut_medico', targetKey: 'rut', as: 'medico'});
CitaMedica.belongsTo(TipoCita, { foreignKey: 'idTipoCita', targetKey: 'idTipoCita', as: 'tipoCita', onDelete: 'CASCADE' });
CitaMedica.hasOne(Factura, { foreignKey: 'id_cita', sourceKey: 'idCita', as: 'factura', onDelete: 'CASCADE' });

// Asociaciones para Medico
Medico.hasMany(CitaMedica, { foreignKey: 'rut_medico', sourceKey: 'rut'});
Medico.hasMany(HorarioMedic, { foreignKey: 'rut_medico', sourceKey: 'rut', onDelete: 'CASCADE' });
HorarioMedic.belongsTo(Medico, { foreignKey: 'rut_medico', targetKey: 'rut', as: 'medico', onDelete: 'CASCADE' });

// Asociación de HistorialMedico con Usuario
HistorialMedico.belongsTo(Usuario, { foreignKey: 'rut_paciente', targetKey: 'rut', as: 'paciente', onDelete: 'CASCADE' });

// Asociación de Factura con CitaMedica
Factura.belongsTo(CitaMedica, { foreignKey: 'id_cita', targetKey: 'idCita', as: 'citaMedica', onDelete: 'CASCADE' });

HistorialMedico.belongsTo(Medico, { foreignKey: 'rut_medico', targetKey: 'rut', as: 'medico', onDelete: 'CASCADE' });
