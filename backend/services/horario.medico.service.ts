import horarioMedicoRepository from '../repositories/HorarioMedicoRepository';
import Medico from '../models/medico';

export class HorarioMedicoService {
    // Obtener todos los horarios médicos con paginación
    async getHorariosMedicos(desde: number, limite: number) {
        const include = [{
            model: Medico,
            as: 'medico',
            attributes: ['nombre', 'apellidos', 'especialidad_medica'],
            where: { estado: 'activo' }
        }];

        return horarioMedicoRepository.findAll({
            include,
            offset: desde,
            limit: limite
        });
    }

    // Obtener un horario médico por su ID
    async getHorarioMedico(idHorario: number) {
        return horarioMedicoRepository.findByPk(idHorario);
    }

    // Crear un nuevo horario médico con validación de solapamiento
    async crearHorarioMedico(horarioData: any) {
        const { rut_medico, diaSemana, horaInicio, horaFinalizacion } = horarioData;

        // Verificar solapamiento
        const horariosExistentes = await horarioMedicoRepository.findOverlappingSchedules(
            rut_medico, 
            diaSemana, 
            horaInicio, 
            horaFinalizacion
        );

        if (horariosExistentes.length > 0) {
            throw new Error('Ya existe un horario solapado para este médico en el mismo día');
        }

        return horarioMedicoRepository.create(horarioData);
    }

    // Actualizar un horario médico existente
    async actualizarHorarioMedico(idHorario: number, horarioData: any) {
        const horario = await horarioMedicoRepository.findByPk(idHorario);
        if (!horario) throw new Error('Horario no encontrado');

        const { rut_medico, diaSemana, horaInicio, horaFinalizacion } = horarioData;

        // Verificar solapamiento excluyendo el horario actual
        const horariosExistentes = await horarioMedicoRepository.findOverlappingSchedules(
            rut_medico, 
            diaSemana, 
            horaInicio, 
            horaFinalizacion,
            idHorario
        );

        if (horariosExistentes.length > 0) {
            throw new Error('Ya existe un horario solapado para este médico en el mismo día');
        }

        return horarioMedicoRepository.update(horario, horarioData);
    }

    // Eliminar un horario médico
    async eliminarHorarioMedico(idHorario: number) {
        const horario = await horarioMedicoRepository.findByPk(idHorario);
        if (!horario) throw new Error('Horario no encontrado');
        
        return horarioMedicoRepository.destroy(horario);
    }
}

export default new HorarioMedicoService();