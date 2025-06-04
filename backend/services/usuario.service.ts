import usuarioRepository from '../repositories/usuario.repository';
import AuthService from './auth.service';
import bcrypt from 'bcrypt';
import Rol from '../models/rol';

class UsuarioService {
    async getPaginatedUsers(desde: number) {
        const [total, usuarios] = await Promise.all([
            usuarioRepository.countActiveUsers(),
            usuarioRepository.findActiveUsers(desde)
        ]);
        
        return { total, usuarios };
    }

    async getAllPatients() {
        return usuarioRepository.findAllPatients();
    }

    async createUser(userData: any) {
        const { email, telefono, rol: rolCodigo } = userData;
        
        // Validaciones
        if (await AuthService.instance.verificarEmailExistente(email)) {
            throw new Error('El correo ya está registrado');
        }
        
        if (await AuthService.instance.verificarTelefonoExistente(telefono)) {
            throw new Error('El teléfono ya está registrado');
        }

        // Obtener ID del rol
        let rolId = 2; // USER_ROLE por defecto
        if (rolCodigo) {
            const rol = await Rol.findOne({ where: { codigo: rolCodigo } });
            if (rol) rolId = rol.id;
        }

        // Crear usuario
        return usuarioRepository.createUser({
            ...userData,
            rolId
        });
    }

    async updateUser(id: string, updateData: any) {
        if (updateData.rol) {
            const rol = await Rol.findOne({ where: { codigo: updateData.rol } });
            if (rol) {
                updateData.rolId = rol.id;
            }
            delete updateData.rol;
        }
        
        return usuarioRepository.updateUser(id, updateData);
    }

    async deleteUser(id: string) {
        return usuarioRepository.deleteUser(id);
    }

    async changePassword(rut: string, currentPassword: string, newPassword: string) {
        const usuario = await usuarioRepository.findById(rut);
        if (!usuario) throw new Error('Usuario no encontrado');
        
        // Validar contraseña actual
        const validPassword = bcrypt.compareSync(currentPassword, usuario.password);
        if (!validPassword) throw new Error('Contraseña actual incorrecta');
        
        // Validar nueva contraseña
        const samePassword = bcrypt.compareSync(newPassword, usuario.password);
        if (samePassword) throw new Error('La nueva contraseña no puede ser igual a la actual');
        
        // Encriptar y actualizar
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newPassword, salt);
        
        return usuarioRepository.changePassword(rut, hashedPassword);
    }

        // Obtener pacientes con citas en estados específicos
    async getPatientsWithAppointments(rut_medico: string, estados: string[]) {
        const citas = await usuarioRepository.getPatientsWithAppointments(rut_medico, estados);
        
        // Extraer pacientes únicos
        const pacientesMap = new Map();
        citas.forEach(cita => {
            if (cita.paciente && !pacientesMap.has(cita.paciente.rut)) {
                pacientesMap.set(cita.paciente.rut, cita.paciente);
            }
        });
        
        return Array.from(pacientesMap.values());
    }

    // Métodos para las consultas específicas de pacientes...
}

export default new UsuarioService();