import citaRepository from '../repositories/CitaRepository';
import { CitaMedicaAttributes } from '../models/cita_medica';
import { Op } from 'sequelize';

export class CitaService {
    // Lógica para obtener citas con paginación
    async getCitas(desde: number, limite: number) {
        const defaultFilters = {
            estado_actividad: 'activo',
            estado: { [Op.ne]: 'no_pagado' }
        };

        return citaRepository.findAndCountAll({
            where: defaultFilters,
            include: this.getDefaultIncludes(),
            attributes: ['idCita', 'motivo', 'fecha', 'hora_inicio', 'hora_fin', 'estado'],
            offset: desde,
            limit: limite
        });
    }

    // Lógica para obtener citas de un médico
    async getCitasMedico(rut_medico: string, desde: number, limite: number) {
        const where = {
            rut_medico,
            estado: { [Op.or]: ['en_curso', 'pagado', 'terminado'] },
            estado_actividad: 'activo'
        };

        const { count, rows } = await citaRepository.findAndCountAll({
            where,
            include: this.getDefaultIncludes(),
            attributes: { exclude: ['rut_paciente', 'rut_medico'] },
            offset: desde,
            limit: limite
        });

        return { count, citas: rows };
    }

    // Lógica para obtener citas de un paciente
    async getCitasPaciente(rut_paciente: string, desde: number, limite: number) {
        const where = {
            rut_paciente,
            estado: { [Op.or]: ['en_curso', 'pagado', 'terminado'] },
            estado_actividad: 'activo'
        };

        const { count, rows } = await citaRepository.findAndCountAll({
            where,
            include: this.getDefaultIncludes(),
            attributes: { exclude: ['rut_paciente', 'rut_medico'] },
            offset: desde,
            limit: limite
        });

        return { count, citas: rows };
    }

    // Lógica para obtener cita con factura
    async getCitaFactura(idCita: number) {
        return citaRepository.findByPk(idCita, {
            include: [
                ...this.getDefaultIncludes(),
                {
                    association: 'factura',
                    required: false
                }
            ]
        });
    }

    // Lógica para crear cita
    async crearCita(citaData: CitaMedicaAttributes) {
        return citaRepository.create(citaData);
    }

    // Lógica para verificar citas existentes de un usuario
    async verificarCitasUsuario(rut_paciente: string): Promise<boolean> {
        const citaExistente = await citaRepository.findOne({
            where: {
                rut_paciente,
                estado: { [Op.or]: ['pagado', 'en_curso'] },
                estado_actividad: 'activo'
            }
        });

        return !!citaExistente;
    }

    // Lógica para crear cita como paciente
    async crearCitaPaciente(citaData: any) {
        const puedeAgendar = !(await this.verificarCitasUsuario(citaData.rutPaciente));

        if (!puedeAgendar) {
            throw new Error('Ya tienes una cita programada');
        }

        return citaRepository.create({
            rut_paciente: citaData.rutPaciente,
            rut_medico: citaData.rutMedico,
            fecha: citaData.fecha,
            hora_inicio: citaData.hora_inicio,
            hora_fin: citaData.hora_fin,
            estado: 'no_pagado',
            motivo: citaData.especialidad,
            idTipoCita: citaData.idTipoCita
        });
    }

    // Lógica para actualizar cita
    async actualizarCita(idCita: number, citaData: Partial<CitaMedicaAttributes>) {
        const cita = await citaRepository.findByPk(idCita);
        if (!cita) throw new Error('Cita no encontrada');
        
        return citaRepository.update(cita, citaData);
    }

    // Lógica para eliminar (soft delete) cita
    async eliminarCita(idCita: number) {
        const cita = await citaRepository.findByPk(idCita);
        if (!cita) throw new Error('Cita no encontrada');
        
        return citaRepository.update(cita, { estado_actividad: 'inactivo' });
    }

    private getDefaultIncludes() {
        return [
            { association: 'paciente', attributes: ['nombre', 'apellidos'] },
            { association: 'medico', attributes: ['nombre', 'apellidos'] },
            { association: 'tipoCita', attributes: ['especialidad_medica'] }
        ];
    }
}

export default new CitaService();