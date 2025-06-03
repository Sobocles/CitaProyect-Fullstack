"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cambiarPassword = exports.deleteUsuario = exports.putUsuario = exports.getUsuario = exports.getPacientesConCitasPagadasYEnCursoYterminado = exports.getPacientesConCitasPagadasYEnCurso = exports.getAllUsuarios = exports.CrearUsuario = exports.getUsuarios = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const historial_medico_1 = __importDefault(require("../models/historial_medico"));
const cita_medica_1 = __importDefault(require("../models/cita_medica"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
const rol_1 = __importDefault(require("../models/rol"));
const authService = auth_service_1.default.instance;
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const desde = Number(req.query.desde) || 0;
        // Obtén el total de usuarios activos
        const totalUsuarios = yield usuario_1.default.count({
            where: { estado: 'activo' } // Incluye solo usuarios activos
        });
        // Obtén los detalles de todos los usuarios activos con paginación y sin mostrar campos sensibles
        const usuarios = yield usuario_1.default.findAll({
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            },
            where: { estado: 'activo' },
            include: [{
                    model: rol_1.default,
                    as: 'rol',
                    attributes: ['id', 'nombre', 'codigo']
                }],
            offset: desde,
            limit: 5,
        });
        res.json({
            ok: true,
            usuarios,
            total: totalUsuarios
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});
exports.getUsuarios = getUsuarios;
const CrearUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('========= INICIO CREAR USUARIO =========');
    console.log('Datos recibidos:', req.body);
    const { email, password, nombre, apellidos, telefono, rol: rolCodigo } = req.body;
    try {
        // Verificar si el correo ya está registrado
        console.log('Verificando email existente:', email);
        if (yield authService.verificarEmailExistente(email)) {
            console.log('Email ya registrado');
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado',
            });
        }
        // Verificar si el teléfono ya está registrado
        console.log('Verificando teléfono existente:', telefono);
        if (yield authService.verificarTelefonoExistente(telefono)) {
            console.log('Teléfono ya registrado');
            return res.status(400).json({
                ok: false,
                msg: 'El teléfono ya está registrado',
            });
        }
        // Obtener el ID del rol basado en el código proporcionado o usar el predeterminado (USER_ROLE)
        let rolId = 2; // ID predeterminado para el rol de usuario (USER_ROLE)
        if (rolCodigo) {
            const rol = yield rol_1.default.findOne({ where: { codigo: rolCodigo } });
            if (rol) {
                rolId = rol.id;
            }
            else {
                console.log(`Rol con código ${rolCodigo} no encontrado, usando rol predeterminado`);
            }
        }
        // Preparar los datos del usuario con rolId en lugar de rol
        const userData = Object.assign(Object.assign({}, req.body), { rolId: rolId });
        // Eliminar el campo rol si existe para evitar conflictos
        delete userData.rol;
        // Usar el servicio para registrar al usuario
        console.log('Registrando usuario mediante authService con rolId:', rolId);
        const resultado = yield authService.registrarUsuario(userData);
        console.log(resultado);
        console.log('Usuario registrado exitosamente:', resultado.userOrMedico.rut);
        // Devolver respuesta en el formato esperado por el frontend
        console.log('Enviando respuesta exitosa');
        res.json({
            ok: true,
            usuario: resultado.userOrMedico,
            token: resultado.token,
        });
    }
    catch (error) {
        console.error('ERROR EN CREAR USUARIO:', error);
        if (error instanceof Error) {
            console.error('Mensaje del error:', error.message);
            console.error('Stack trace:', error.stack);
        }
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs',
        });
    }
    finally {
        console.log('========= FIN CREAR USUARIO =========');
    }
});
exports.CrearUsuario = CrearUsuario;
// Método para obtener a todos los pacientes
const getAllUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener los detalles de todos los pacientes que no son administradores y que están activos
        const usuarios = yield usuario_1.default.findAll({
            include: [{
                    model: rol_1.default,
                    as: 'rol',
                    where: {
                        codigo: {
                            [sequelize_1.Op.ne]: 'ADMIN_ROLE' // Excluye a los usuarios con rol 'ADMIN_ROLE'
                        }
                    }
                }, {
                    model: cita_medica_1.default,
                    attributes: ['idCita', 'estado', 'fecha', 'hora_inicio', 'hora_fin'],
                    where: {
                        estado: {
                            [sequelize_1.Op.or]: ['en_curso', 'no_asistido', 'pagado']
                        }
                    },
                    required: false // Incluye usuarios incluso si no tienen citas en esos estados
                }],
            where: {
                estado: 'activo' // Incluye solo usuarios activos
            },
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt'] // Excluye estos atributos
            }
        });
        // Obtén el total de pacientes activos que no son administradores
        const totalPacientes = usuarios.length;
        res.json({
            ok: true,
            usuarios,
            total: totalPacientes
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});
exports.getAllUsuarios = getAllUsuarios;
const getPacientesConCitasPagadasYEnCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rut_medico } = req.params;
    try {
        // Obténer los detalles de los pacientes con citas en estado 'en_curso' y 'pagado' con un médico específico
        const pacientesConCitasPagadas = yield cita_medica_1.default.findAll({
            where: {
                rut_medico,
                estado: ['en_curso', 'pagado', 'terminado'],
                estado_actividad: 'activo' // Solo citas activas
            },
            include: [{
                    model: usuario_1.default,
                    as: 'paciente',
                    include: [{
                            model: rol_1.default,
                            as: 'rol',
                            where: {
                                codigo: {
                                    [sequelize_1.Op.ne]: 'ADMIN_ROLE' // Excluye a los usuarios con rol 'ADMIN_ROLE'
                                }
                            }
                        }],
                    where: {
                        estado: 'activo' // Solo usuarios activos
                    },
                    attributes: {
                        exclude: ['password', 'createdAt', 'updatedAt']
                    }
                }]
        });
        // Mapea los resultados para obtener solo los datos de los pacientes
        const usuarios = pacientesConCitasPagadas.map(cita => cita.paciente);
        res.json({
            ok: true,
            usuarios,
            total: usuarios.length
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});
exports.getPacientesConCitasPagadasYEnCurso = getPacientesConCitasPagadasYEnCurso;
const getPacientesConCitasPagadasYEnCursoYterminado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rut_medico } = req.params;
    try {
        // Obténer los detalles de los pacientes con citas en estado 'en_curso' y 'pagado' con un médico específico
        const pacientesConCitasPagadas = yield cita_medica_1.default.findAll({
            where: {
                rut_medico,
                estado: ['en_curso', 'pagado', 'terminado'],
                estado_actividad: 'activo' // Solo citas activas
            },
            include: [{
                    model: usuario_1.default,
                    as: 'paciente',
                    include: [{
                            model: rol_1.default,
                            as: 'rol',
                            where: {
                                codigo: {
                                    [sequelize_1.Op.ne]: 'ADMIN_ROLE' // Excluye a los usuarios con rol 'ADMIN_ROLE'
                                }
                            }
                        }],
                    where: {
                        estado: 'activo' // Solo usuarios activos
                    },
                    attributes: {
                        exclude: ['password', 'createdAt', 'updatedAt']
                    }
                }]
        });
        // Mapea los resultados para obtener solo los datos de los pacientes
        const usuarios = pacientesConCitasPagadas.map(cita => cita.paciente);
        res.json({
            ok: true,
            usuarios,
            total: usuarios.length
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});
exports.getPacientesConCitasPagadasYEnCursoYterminado = getPacientesConCitasPagadasYEnCursoYterminado;
const getUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const usuario = yield usuario_1.default.findByPk(id, {
            include: [{
                    model: rol_1.default,
                    as: 'rol',
                    attributes: ['id', 'nombre', 'codigo']
                }]
        });
        if (usuario) {
            return res.json(usuario);
        }
        return res.status(404).json({
            msg: `No existe un usuario con el id ${id}`
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});
exports.getUsuario = getUsuario;
const putUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let { body } = req;
        // Si se incluye un código de rol, buscar su ID correspondiente
        if (body.rol) {
            const rol = yield rol_1.default.findOne({ where: { codigo: body.rol } });
            if (rol) {
                body.rolId = rol.id;
            }
            // Eliminar el campo rol para evitar conflictos
            delete body.rol;
        }
        // Buscar el usuario por su ID
        const usuario = yield usuario_1.default.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }
        // Si la contraseña no está presente o está vacía en la solicitud, elimínala del objeto body
        if (!body.password || body.password.trim() === '') {
            delete body.password;
        }
        // Actualizar los campos del usuario con los valores proporcionados en el cuerpo de la solicitud
        yield usuario.update(body);
        res.json({
            usuario,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
});
exports.putUsuario = putUsuario;
const deleteUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const usuario = yield usuario_1.default.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ msg: 'No existe un usuario con el id ' + id });
        }
        // Cambiar el estado de las citas médicas a 'inactivo'
        yield cita_medica_1.default.update({ estado_actividad: 'inactivo' }, { where: { rut_paciente: usuario.rut } });
        // Cambiar el estado de los historiales médicos a 'inactivo'
        yield historial_medico_1.default.update({ estado_actividad: 'inactivo' }, { where: { rut_paciente: usuario.rut } });
        // Cambiar el estado del usuario a 'inactivo'
        yield usuario.update({ estado: 'inactivo' });
        res.json({ msg: `Usuario ${usuario.nombre} y todas sus entidades relacionadas han sido actualizadas a inactivo correctamente.` });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});
exports.deleteUsuario = deleteUsuario;
const cambiarPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { rut, password, newPassword } = req.body;
    try {
        // agregar el password nuevo != password anterior
        const dbUsuario = yield usuario_1.default.findByPk(rut);
        if (!dbUsuario) {
            return res.status(400).json({
                msg: `No existe el usuario con id: ${rut}`
            });
        }
        const validPassword = bcrypt_1.default.compareSync(password, dbUsuario.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: `El password es incorrecto`
            });
        }
        const validNewPassword = bcrypt_1.default.compareSync(newPassword, dbUsuario.password);
        if (validNewPassword) {
            return res.status(400).json({
                ok: false,
                msg: `El password nuevo es igual al password anterior`
            });
        }
        const salt = bcrypt_1.default.genSaltSync();
        dbUsuario.password = bcrypt_1.default.hashSync(newPassword, salt);
        dbUsuario.save();
        return res.status(200).json({
            ok: true,
            msg: `El usuario ${dbUsuario.nombre} ha cambiado de contraseña`
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: true,
            msg: `Error conectarse con el servidor`
        });
    }
});
exports.cambiarPassword = cambiarPassword;
//# sourceMappingURL=usuario.js.map