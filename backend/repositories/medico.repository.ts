import Medico from '../models/medico';
import Rol from '../models/rol';
import CitaMedica from '../models/cita_medica';
import HorarioMedic from '../models/horario_medico';
import { Op } from 'sequelize';
import TipoCita from '../models/tipo_cita';

class MedicoRepository {
    // Obtener médicos paginados
    async findActiveMedicos(desde: number, limit: number = 5) {
        return Medico.findAll({
            where: { estado: 'activo' },
            include: [{
                model: Rol,
                as: 'rol',
                attributes: ['id', 'nombre', 'codigo']
            }],
            offset: desde,
            limit
        });
    }

    // Contar médicos activos
    async countActiveMedicos() {
        return Medico.count({ where: { estado: 'activo' } });
    }

    // Obtener todos los médicos activos (sin paginación)
    async findAllActiveMedicos() {
        return Medico.findAll({
            where: { estado: 'activo' },
            include: [{
                model: Rol,
                as: 'rol',
                attributes: ['id', 'nombre', 'codigo']
            }]
        });
    }

    // Obtener médicos por especialidad (con especialidades válidas)
    async findMedicosByValidEspecialidades() {
        // Obtener especialidades válidas
        const especialidadesValidas = await TipoCita.findAll({
            attributes: ['especialidad_medica']
        });
        const especialidades = especialidadesValidas.map(ec => ec.especialidad_medica);

        // Obtener médicos activos
        const medicos = await Medico.findAll({
            attributes: ['rut', 'nombre', 'apellidos', 'especialidad_medica'],
            include: [{
                model: Rol,
                as: 'rol',
                attributes: ['codigo']
            }],
            where: { estado: 'activo' }
        });

        // Procesar para compatibilidad y filtrar
        return medicos
            .map(medico => {
                const medicoJSON = medico.toJSON();
                if (medicoJSON.rol && medicoJSON.rol.codigo) {
                    medicoJSON.rol = medicoJSON.rol.codigo;
                }
                return medicoJSON;
            })
            .filter(medico => especialidades.includes(medico.especialidad_medica));
    }

    // Buscar médico por ID
    async findById(rut: string) {
        return Medico.findByPk(rut, {
            include: [{
                model: Rol,
                as: 'rol',
                attributes: ['id', 'nombre', 'codigo']
            }]
        });
    }

    // Buscar por email
    async findByEmail(email: string) {
        return Medico.findOne({ 
            where: { email },
            include: [{
                model: Rol,
                as: 'rol',
                attributes: ['id', 'nombre', 'codigo']
            }]
        });
    }

    // Buscar por teléfono
    async findByPhone(telefono: string) {
        return Medico.findOne({ where: { telefono } });
    }

    // Crear médico
    async createMedico(medicoData: any) {
        return Medico.create(medicoData);
    }

    // Actualizar médico
    async updateMedico(rut: string, data: any) {
        const medico = await Medico.findByPk(rut);
        if (!medico) return null;
        return medico.update(data);
    }

    // Eliminar médico (marcar como inactivo y actualizar entidades relacionadas)
    async deleteMedico(rut: string) {
        const medico = await Medico.findByPk(rut);
        if (!medico) return null;
        
        // Actualizar citas médicas en estados específicos
        await CitaMedica.update(
            { estado_actividad: 'inactivo' },
            { 
                where: { 
                    rut_medico: rut,
                    estado: { [Op.in]: ['terminado', 'no_pagado', 'no_asistio'] }
                }
            }
        );
        
        // Eliminar horarios del médico
        await HorarioMedic.destroy({ where: { rut_medico: rut } });
        
        // Marcar médico como inactivo
        return medico.update({ estado: 'inactivo' });
    }

    // Cambiar contraseña
    async changePassword(rut: string, newPassword: string) {
        const medico = await Medico.findByPk(rut);
        if (!medico) return null;
        return medico.update({ password: newPassword });
    }

     async updateWhere(where: any, data: any) {
    return Medico.update(data, { where });
  }
}

// Ejemplo para CitaRepository
export class CitaRepository {
  // ... otros métodos
  

}

export default new MedicoRepository();