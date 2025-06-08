import medicoRepository from '../repositories/medico.repository';
import bcrypt from 'bcrypt';
import Rol from '../models/rol';
import { UserRole } from '../types/enums';
import AuthService from './auth.service';

class MedicoService {
    async getPaginatedMedicos(desde: number) {
        const [total, medicos] = await Promise.all([
            medicoRepository.countActiveMedicos(),
            medicoRepository.findActiveMedicos(desde)
        ]);
        
        return { total, medicos };
    }

    async getAllMedicos() {
        const medicos = await medicoRepository.findAllActiveMedicos();
        const total = medicos.length;
        
        // Procesar para asignar el rol como string
        const medicosProcesados = medicos.map(medico => {
            const medicoJSON = medico.toJSON();
            if (medicoJSON.rol && medicoJSON.rol.codigo) {
                medicoJSON.rol = medicoJSON.rol.codigo;
            }
            return medicoJSON;
        });
        
        return { total, medicos: medicosProcesados };
    }

    async getMedicosByEspecialidad() {
        return medicoRepository.findMedicosByValidEspecialidades();
    }

    async getMedicoById(rut: string) {
        const medico = await medicoRepository.findById(rut);
        if (!medico) return null;
        
        // Procesar para asignar el rol como string
        const medicoJSON = medico.toJSON();
        if (medicoJSON.rol && medicoJSON.rol.codigo) {
            medicoJSON.rol = medicoJSON.rol.codigo;
        }
        return medicoJSON;
    }

    async createMedico(medicoData: any) {
        const { email, rut, telefono, rol: rolCodigo, password } = medicoData;
        
        // Validar email único
        if (await AuthService.instance.verificarEmailExistente(email)) {
            throw new Error('El correo ya está registrado');
        }
        
        // Validar RUT único
        const existeRut = await medicoRepository.findById(rut);
        if (existeRut) {
            throw new Error('El RUT ya está registrado');
        }
        
        // Validar teléfono único
        if (await AuthService.instance.verificarTelefonoExistente(telefono)) {
            throw new Error('El teléfono ya está registrado');
        }
        
        // Obtener ID del rol
        let rolId = 3; // MEDICO_ROLE por defecto
        if (rolCodigo) {
            const rol = await Rol.findOne({ where: { codigo: rolCodigo } });
            if (rol) rolId = rol.id;
        } else {
            const rolMedico = await Rol.findOne({ where: { codigo: UserRole.MEDICO } });
            if (rolMedico) rolId = rolMedico.id;
        }
        
        // Encriptar contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Crear médico
        return medicoRepository.createMedico({
            ...medicoData,
            password: hashedPassword,
            rolId
        });
    }

    async updateMedico(rut: string, updateData: any) {
        if (updateData.rol) {
            const rol = await Rol.findOne({ where: { codigo: updateData.rol } });
            if (rol) {
                updateData.rolId = rol.id;
            }
            delete updateData.rol;
        }
        
        return medicoRepository.updateMedico(rut, updateData);
    }

    async deleteMedico(rut: string) {
        return medicoRepository.deleteMedico(rut);
    }

    async changePassword(rut: string, currentPassword: string, newPassword: string) {
        const medico = await medicoRepository.findById(rut);
        if (!medico) throw new Error('Médico no encontrado');
        
        // Validar contraseña actual
        const validPassword = bcrypt.compareSync(currentPassword, medico.password);
        if (!validPassword) throw new Error('Contraseña actual incorrecta');
        
        // Validar nueva contraseña
        const samePassword = bcrypt.compareSync(newPassword, medico.password);
        if (samePassword) throw new Error('La nueva contraseña no puede ser igual a la actual');
        
        // Encriptar y actualizar
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newPassword, salt);
        
        return medicoRepository.changePassword(rut, hashedPassword);
    }
}

export default new MedicoService();