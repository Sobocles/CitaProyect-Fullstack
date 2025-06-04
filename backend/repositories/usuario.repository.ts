import Usuario from '../models/usuario';
import Rol from '../models/rol';
import CitaMedica from '../models/cita_medica';
import HistorialMedico from '../models/historial_medico';
import { Op } from 'sequelize';

class UsuarioRepository {
    // Obtener usuarios paginados
    async findActiveUsers(desde: number, limit: number = 5) {
        return Usuario.findAll({
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
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

    // Contar usuarios activos
    async countActiveUsers() {
        return Usuario.count({ where: { estado: 'activo' } });
    }

    // Obtener todos los pacientes (no administradores)
    async findAllPatients() {
        return Usuario.findAll({
            include: [{
                model: Rol,
                as: 'rol',
                where: { codigo: { [Op.ne]: 'ADMIN_ROLE' } }
            }, {
                model: CitaMedica,
                attributes: ['idCita', 'estado', 'fecha', 'hora_inicio', 'hora_fin'],
                where: { estado: { [Op.or]: ['en_curso', 'no_asistido', 'pagado'] } },
                required: false
            }],
            where: { estado: 'activo' },
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
        });
    }

    // Crear usuario
    async createUser(userData: any) {
        return Usuario.create(userData);
    }

    // Buscar usuario por ID
    async findById(id: string) {
        return Usuario.findByPk(id, {
            include: [{
                model: Rol,
                as: 'rol',
                attributes: ['id', 'nombre', 'codigo']
            }]
        });
    }

    // Actualizar usuario
    async updateUser(id: string, data: any) {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) return null;
        return usuario.update(data);
    }

    // Eliminar usuario (marcar como inactivo)
    async deleteUser(id: string) {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) return null;
        
        // Actualizar entidades relacionadas
        await CitaMedica.update(
            { estado_actividad: 'inactivo' },
            { where: { rut_paciente: usuario.rut } }
        );
        
        await HistorialMedico.update(
            { estado_actividad: 'inactivo' },
            { where: { rut_paciente: usuario.rut } }
        );
        
        return usuario.update({ estado: 'inactivo' });
    }

    // Buscar por email
    async findByEmail(email: string) {
        return Usuario.findOne({ where: { email } });
    }

    // Buscar por teléfono
    async findByPhone(telefono: string) {
        return Usuario.findOne({ where: { telefono } });
    }

    // Cambiar contraseña
    async changePassword(rut: string, newPassword: string) {
        const usuario = await Usuario.findByPk(rut);
        if (!usuario) return null;
        return usuario.update({ password: newPassword });
    }

        async getPatientsWithAppointments(rut_medico: string, estados: string[]) {
        return CitaMedica.findAll({
            where: {
                rut_medico,
                estado: estados,
                estado_actividad: 'activo'
            },
            include: [{
                model: Usuario,
                as: 'paciente',
                include: [{
                    model: Rol,
                    as: 'rol',
                    where: { codigo: { [Op.ne]: 'ADMIN_ROLE' } }
                }],
                where: { estado: 'activo' },
                attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
            }]
        });
    }

    // Métodos adicionales para las consultas específicas...
}

export default new UsuarioRepository();