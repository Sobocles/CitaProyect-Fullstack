import historialMedicoRepository from '../repositories/HistorialMedicoRepository';
import citaMedicaRepository from '../repositories/CitaRepository'; // Asume que existe
import { Op } from 'sequelize';

export class HistorialMedicoService {
    // Obtener todos los historiales médicos
    async getHistoriales() {
        return historialMedicoRepository.findAndCountAll({});
    }

    // Obtener historiales de un paciente (con paginación)
    async getHistorialPaciente(rut_paciente: string, desde: number, limite: number) {
        const where = { 
            rut_paciente,
            estado: 'activo'
        };

        const include = [{
            association: 'medico',
            where: { estado: 'activo' },
            attributes: ['nombre', 'apellidos']
        }];

        const { count, rows } = await historialMedicoRepository.findAndCountAll({
            where,
            include,
            offset: desde,
            limit: limite,
            attributes: { exclude: ['rut_medico'] }
        });

        return { count, historiales: rows };
    }

    // Obtener historiales de un médico (con paginación)
    async getHistorialMedico(rut_medico: string, desde: number, limite: number) {
        const where = { 
            rut_medico,
            estado: 'activo'
        };

        const include = [{
            association: 'paciente',
            where: { estado: 'activo' },
            attributes: ['nombre', 'apellidos', 'rut']
        }];

        const { count, rows } = await historialMedicoRepository.findAndCountAll({
            where,
            include,
            offset: desde,
            limit: limite,
            attributes: { exclude: ['rut_paciente'] }
        });

        return { count, historiales: rows };
    }

    // Obtener un historial por su ID
    async getHistorialPorId(id_historial: number) {
        return historialMedicoRepository.findByPk(id_historial);
    }

    // Crear un historial médico y actualizar cita relacionada
    async crearHistorial(historialData: any) {
        // Verificar si ya existe
        const historialExistente = await historialMedicoRepository.findByPk(
            historialData.id_historial_medico
        );
        
        if (historialExistente) {
            throw new Error('Ya existe un historial médico con el mismo ID');
        }

        // Buscar cita médica relacionada
        const citaRelacionada = await citaMedicaRepository.findOne({
            where: {
                rut_paciente: historialData.rut_paciente,
                rut_medico: historialData.rut_medico,
                estado: { [Op.or]: ['en_curso', 'pagado'] }
            }
        });

        if (!citaRelacionada) {
            throw new Error('No se encontró cita médica relacionada');
        }

        // Actualizar estado de la cita
        await citaMedicaRepository.update(citaRelacionada, { estado: 'terminado' });

        // Crear el historial médico
        return historialMedicoRepository.create(historialData);
    }

    // Actualizar un historial médico
    async actualizarHistorial(id_historial: number, historialData: any) {
        const historial = await historialMedicoRepository.findByPk(id_historial);
        if (!historial) throw new Error('Historial no encontrado');
        
        return historialMedicoRepository.update(historial, historialData);
    }

    // Eliminar (soft delete) un historial médico
    async eliminarHistorial(id_historial: number) {
        const historial = await historialMedicoRepository.findByPk(id_historial);
        if (!historial) throw new Error('Historial no encontrado');
        
        return historialMedicoRepository.update(historial, { estado: 'inactivo' });
    }
}

export default new HistorialMedicoService();