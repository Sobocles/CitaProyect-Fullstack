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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const medico_1 = __importDefault(require("../models/medico"));
const horario_medico_1 = __importDefault(require("../models/horario_medico"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = __importDefault(require("../helpers/jwt"));
const tipo_cita_1 = __importDefault(require("../models/tipo_cita"));
const cita_medica_1 = __importDefault(require("../models/cita_medica"));
const sequelize_1 = require("sequelize");
class Medicos {
    constructor() {
        this.getMedicos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('Obteniendo médicos...');
            try {
                const desde = Number(req.query.desde) || 0;
                // Obtén el total de médicos activos
                const totalMedicos = yield medico_1.default.count({
                    where: {
                        estado: 'activo' // Contar solo médicos activos
                    }
                });
                // Obtén los detalles de todos los médicos activos
                const medicos = yield medico_1.default.findAll({
                    where: {
                        estado: 'activo' // Filtrar por médicos activos
                    },
                    offset: desde,
                    limit: 5,
                });
                res.json({
                    ok: true,
                    medicos,
                    total: totalMedicos
                });
            }
            catch (error) {
                console.error('Error al obtener los médicos:', error);
                res.status(500).json({
                    msg: 'Error en el servidor',
                });
            }
        });
        this.getMedicosEspecialidad = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener todas las especialidades válidas de TipoCita
                const especialidadesValidas = yield tipo_cita_1.default.findAll({
                    attributes: ['especialidad_medica']
                });
                const especialidades = especialidadesValidas.map(ec => ec.especialidad_medica);
                // Obtener todos los médicos activos
                const medicos = yield medico_1.default.findAll({
                    attributes: ['rut', 'nombre', 'apellidos', 'especialidad_medica'],
                    where: {
                        estado: 'activo' // Agregar condición para filtrar solo médicos activos
                    }
                });
                // Filtrar los médicos que tienen una especialidad válida
                const medicosFiltrados = medicos.filter(medico => especialidades.includes(medico.especialidad_medica));
                res.json({
                    ok: true,
                    medicos: medicosFiltrados
                });
            }
            catch (error) {
                console.error('Error al obtener los médicos y sus especialidades:', error);
                res.status(500).json({
                    ok: false,
                    msg: 'Error en el servidor'
                });
            }
        });
        this.getAllMedicos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('olaaaaaa aquí');
            try {
                // Obtén el total de médicos activos
                const totalMedicosActivos = yield medico_1.default.count({
                    where: { estado: 'activo' } // Filtra por estado activo
                });
                // Obtén los detalles de todos los médicos activos
                const medicosActivos = yield medico_1.default.findAll({
                    where: { estado: 'activo' } // Filtra por estado activo
                });
                res.json({
                    ok: true,
                    medicos: medicosActivos,
                    total: totalMedicosActivos
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    msg: 'Error en el servidor',
                });
            }
        });
        this.getMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { rut } = req.params;
            try {
                const medico = yield medico_1.default.findByPk(rut);
                if (!medico) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Médico no encontrado',
                    });
                }
                res.json({
                    ok: true,
                    medico,
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    ok: false,
                    msg: 'Hable con el administrador',
                });
            }
        });
        this.CrearMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { email, password, rut, telefono } = _a, medicoData = __rest(_a, ["email", "password", "rut", "telefono"]);
            try {
                // Verificar si el correo ya está registrado por un médico activo
                const existeEmailMedico = yield medico_1.default.findOne({
                    where: {
                        email,
                        estado: 'activo' // Solo busca entre médicos activos
                    }
                });
                if (existeEmailMedico) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El correo ya está registrado para otro médico',
                    });
                }
                // Verificar si el RUT ya está registrado por un médico activo
                const existeRutMedico = yield medico_1.default.findOne({
                    where: {
                        rut,
                        estado: 'activo' // Solo busca entre médicos activos
                    }
                });
                if (existeRutMedico) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El RUT ya está registrado para otro médico',
                    });
                }
                // Verificar si el teléfono ya está registrado por un médico activo
                const existeTelefonoMedico = yield medico_1.default.findOne({
                    where: {
                        telefono,
                        estado: 'activo' // Solo busca entre médicos activos
                    }
                });
                if (existeTelefonoMedico) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El número de teléfono ya está registrado para otro médico',
                    });
                }
                // Encriptar contraseña
                const saltRounds = 10;
                const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
                // Crea un nuevo médico
                const nuevoMedico = yield medico_1.default.create(Object.assign(Object.assign({}, medicoData), { email,
                    rut,
                    telefono, password: hashedPassword, rol: 'MEDICO_ROLE' }));
                // Genera el JWT
                const token = yield jwt_1.default.instance.generarJWT(nuevoMedico.rut, nuevoMedico.nombre, nuevoMedico.apellidos, nuevoMedico.rol);
                res.json({
                    ok: true,
                    medico: nuevoMedico,
                    token
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    ok: false,
                    msg: 'Hable con el administrador',
                });
            }
        });
        this.putMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { rut } = req.params;
                const { body } = req;
                console.log('aqui esta el rut', rut);
                // Buscar el médico por su ID
                const medico = yield medico_1.default.findByPk(rut);
                if (!medico) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Médico no encontrado',
                    });
                }
                // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
                yield medico.update(body);
                res.json({
                    medico,
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
        this.deleteMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { rut } = req.params;
            try {
                const medico = yield medico_1.default.findByPk(rut);
                if (!medico) {
                    return res.status(404).json({
                        msg: 'No existe un médico con el rut ' + rut,
                    });
                }
                // Encuentra todas las citas médicas asociadas al médico en ciertos estados
                const citas = yield cita_medica_1.default.findAll({
                    where: {
                        rut_medico: medico.rut,
                        estado: {
                            [sequelize_1.Op.in]: ['terminado', 'no_pagado', 'no_asistio']
                        }
                    }
                });
                // Cambia el estado de actividad de las citas médicas seleccionadas a "inactivo"
                for (const cita of citas) {
                    yield cita.update({ estado_actividad: 'inactivo' });
                }
                // Encuentra y elimina todos los horarios asociados al médico
                yield horario_medico_1.default.destroy({ where: { rut_medico: medico.rut } });
                // Cambiar el estado del médico a inactivo
                yield medico.update({ estado: 'inactivo' });
                res.json({ msg: 'Médico, sus citas médicas seleccionadas y horarios asociados actualizados a estado inactivo.' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ msg: 'Error en el servidor' });
            }
        });
        this.cambiarPasswordMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { rut, password, newPassword } = req.body;
            try {
                // Buscar el médico por su RUT
                const dbMedico = yield medico_1.default.findByPk(rut);
                if (!dbMedico) {
                    return res.status(400).json({
                        msg: `No existe el médico con RUT: ${rut}`
                    });
                }
                // Verificar que la contraseña actual sea correcta
                const validPassword = bcrypt_1.default.compareSync(password, dbMedico.password);
                if (!validPassword) {
                    return res.status(400).json({
                        ok: false,
                        msg: `La contraseña actual es incorrecta`
                    });
                }
                // Verificar que la nueva contraseña no sea igual a la actual
                const validNewPassword = bcrypt_1.default.compareSync(newPassword, dbMedico.password);
                if (validNewPassword) {
                    return res.status(400).json({
                        ok: false,
                        msg: `La nueva contraseña no puede ser igual a la contraseña actual`
                    });
                }
                // Actualizar la contraseña
                const salt = bcrypt_1.default.genSaltSync();
                dbMedico.password = bcrypt_1.default.hashSync(newPassword, salt);
                yield dbMedico.save();
                return res.status(200).json({
                    ok: true,
                    msg: `La contraseña del médico ${dbMedico.nombre} ha sido actualizada correctamente`
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    ok: false,
                    msg: `Error al conectar con el servidor`
                });
            }
        });
    }
    static get instance() {
        return this._instance || (this._instance = new Medicos());
    }
}
exports.default = Medicos;
;
//# sourceMappingURL=medico.js.map