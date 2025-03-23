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
exports.getTodo = exports.getDocumentosColeccion = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const medico_1 = __importDefault(require("../models/medico"));
const sequelize_1 = require("sequelize");
const horario_medico_1 = __importDefault(require("../models/horario_medico"));
const cita_medica_1 = __importDefault(require("../models/cita_medica"));
const tipo_cita_1 = __importDefault(require("../models/tipo_cita"));
const factura_1 = __importDefault(require("../models/factura"));
const historial_medico_1 = __importDefault(require("../models/historial_medico"));
const getDocumentosColeccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    console.log('AQUI ESTA LA TABLA', tabla);
    let data = [];
    switch (tabla) {
        case 'usuarios':
            data = yield usuario_1.default.findAll({
                attributes: ['rut', 'nombre', 'apellidos', 'email', 'fecha_nacimiento', 'telefono', 'direccion', 'rol'],
                where: {
                    nombre: {
                        [sequelize_1.Op.like]: `%${busqueda}%`
                    },
                    estado: 'activo'
                }
            });
            break;
        case 'medicos':
            data = yield medico_1.default.findAll({
                attributes: ['rut', 'foto', 'nombre', 'apellidos', 'telefono', 'email', 'direccion', 'nacionalidad', 'especialidad_medica'],
                where: {
                    [sequelize_1.Op.and]: [
                        { nombre: { [sequelize_1.Op.like]: `%${busqueda}%` } },
                        { estado: 'activo' } // Filtrar solo médicos activos
                    ]
                }
            });
            break;
        case 'horario_medico':
            data = yield horario_medico_1.default.findAll({
                attributes: ['idHorario', 'diaSemana', 'horaInicio', 'horaFinalizacion', 'inicio_colacion', 'fin_colacion', 'disponibilidad', 'fechaCreacion'],
                where: {
                    diaSemana: { [sequelize_1.Op.like]: `%${busqueda}%` }
                },
                include: [{
                        model: medico_1.default,
                        as: 'medico',
                        attributes: ['nombre', 'apellidos', 'especialidad_medica'],
                        where: { estado: 'activo' } // Filtrar solo médicos activos
                    }]
            });
            break;
        case 'cita_medica':
            data = yield cita_medica_1.default.findAll({
                attributes: ['idCita', 'motivo', 'fecha', 'hora_inicio', 'hora_fin', 'estado'],
                include: [
                    {
                        model: usuario_1.default,
                        as: 'paciente',
                        attributes: ['nombre', 'apellidos'],
                        required: true
                    },
                    {
                        model: medico_1.default,
                        as: 'medico',
                        attributes: ['nombre', 'apellidos'],
                        required: true
                    },
                    {
                        model: tipo_cita_1.default,
                        as: 'tipoCita',
                        attributes: ['especialidad_medica'],
                    }
                ],
                where: {
                    [sequelize_1.Op.and]: [
                        {
                            [sequelize_1.Op.or]: [
                                { '$paciente.nombre$': { [sequelize_1.Op.like]: `%${busqueda}%` } },
                                { '$medico.nombre$': { [sequelize_1.Op.like]: `%${busqueda}%` } }
                            ]
                        },
                        { estado_actividad: 'activo' } // Añadir esta línea para filtrar solo citas activas
                    ]
                }
            });
            break;
        case 'tipo_cita':
            data = yield tipo_cita_1.default.findAll({
                attributes: ['idTipo', 'especialidad_medica', 'precio', 'duracion_cita'],
                where: {
                    especialidad_medica: {
                        [sequelize_1.Op.like]: `%${busqueda}%`
                    },
                    estado: 'activo' // Agregar esta línea para filtrar por estado activo
                }
            });
            break;
            ;
        case 'facturas':
            data = yield factura_1.default.findAll({
                where: {
                    estado: 'activo'
                },
                include: [{
                        model: cita_medica_1.default,
                        as: 'citaMedica',
                        where: {
                            estado_actividad: 'activo'
                        },
                        include: [
                            {
                                model: usuario_1.default,
                                as: 'paciente',
                                attributes: ['rut', 'nombre', 'apellidos'],
                                where: {
                                    nombre: {
                                        [sequelize_1.Op.like]: `%${busqueda}%`
                                    },
                                    estado: 'activo'
                                },
                                required: true
                            },
                            {
                                model: medico_1.default,
                                as: 'medico',
                                attributes: ['rut', 'nombre', 'apellidos'],
                                where: {
                                    estado: 'activo'
                                },
                                required: true
                            }
                        ],
                        attributes: ['motivo']
                    }],
                attributes: ['id_factura', 'payment_method_id', 'transaction_amount', 'monto_pagado', 'fecha_pago']
            });
            break;
        case 'cita_medico':
            data = yield cita_medica_1.default.findAll({
                attributes: ['idCita', 'motivo', 'fecha', 'hora_inicio', 'hora_fin', 'estado'],
                include: [
                    {
                        model: usuario_1.default,
                        as: 'paciente',
                        attributes: ['nombre'],
                        required: true,
                        where: {
                            estado: 'activo'
                        }
                    },
                    {
                        model: medico_1.default,
                        as: 'medico',
                        attributes: ['nombre'],
                        required: true,
                        where: {
                            estado: 'activo'
                        }
                    },
                    {
                        model: tipo_cita_1.default,
                        as: 'tipoCita',
                        attributes: ['especialidad_medica'],
                    }
                ],
                where: {
                    [sequelize_1.Op.or]: [
                        { '$paciente.nombre$': { [sequelize_1.Op.like]: `%${busqueda}%` } },
                        { '$medico.nombre$': { [sequelize_1.Op.like]: `%${busqueda}%` } }
                    ],
                    estado_actividad: 'activo' // Añadir esta línea para filtrar solo citas activas
                }
            });
            break;
        case 'historiales':
            data = yield historial_medico_1.default.findAll({
                include: [{
                        model: usuario_1.default,
                        as: 'paciente',
                        where: {
                            nombre: {
                                [sequelize_1.Op.like]: `%${busqueda}%`
                            },
                            estado: 'activo'
                        },
                        attributes: ['nombre', 'apellidos', 'rut']
                    }],
                attributes: ['id_historial', 'diagnostico', 'medicamento', 'notas', 'fecha_consulta', 'archivo', 'rut_medico', 'estado'],
                where: {
                    estado: 'activo'
                }
            });
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'Por ahora solo se soporta la búsqueda de usuarios y médicos'
            });
    }
    res.json({
        ok: true,
        citas: data
    });
});
exports.getDocumentosColeccion = getDocumentosColeccion;
const getTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("ola");
    try {
        const busqueda = req.params.busqueda;
        const regex = new RegExp(busqueda, 'i');
        const [usuarios, medicos] = yield Promise.all([
            usuario_1.default.findAll({ where: { nombre: { [sequelize_1.Op.like]: `%${busqueda}%` } } }),
            medico_1.default.findAll({ where: { nombre: { [sequelize_1.Op.like]: `%${busqueda}%` } } }),
        ]);
        res.json({
            ok: true,
            resultados: { usuarios, medicos },
        });
    }
    catch (error) {
        console.error('Error en la búsqueda:', error);
        res.status(500).json({ ok: false, mensaje: 'Error en la búsqueda' });
    }
});
exports.getTodo = getTodo;
//# sourceMappingURL=busquedas.js.map