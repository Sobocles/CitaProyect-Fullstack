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
const tipo_cita_1 = __importDefault(require("../models/tipo_cita"));
const cita_medica_1 = __importDefault(require("../models/cita_medica"));
const sequelize_1 = require("sequelize");
const horario_medico_1 = __importDefault(require("../models/horario_medico"));
const medico_1 = __importDefault(require("../models/medico"));
class tipo_cita {
    constructor() {
        this.getTipoCitas = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const desde = Number(req.query.desde) || 0;
                // Obtén el total de tipo de citas activas
                const totalTipoCitas = yield tipo_cita_1.default.count({
                    where: { estado: 'activo' } // Filtra para contar solo las citas activas
                });
                // Obtén los detalles de todos los tipos de citas activas con paginación
                const tipo_cita = yield tipo_cita_1.default.findAll({
                    where: { estado: 'activo' },
                    offset: desde,
                    limit: 5, // o el límite que prefieras
                });
                res.json({
                    ok: true,
                    tipo_cita,
                    total: totalTipoCitas
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    msg: 'Error en el servidor',
                });
            }
        });
        /*
            getTipoCitas = async (req: Request, res: Response) => {
              try {
                  const desde = Number(req.query.desde) || 0;
          
                  // Obtén el total de tipo de citas
                  const totalTipoCitas = await TipoCita.count();
          
                  // Obtén los detalles de todos los tipos de citas con paginación
                  const tipo_cita = await TipoCita.findAll({
                      offset: desde,
                      limit: 5, // o el límite que prefieras
                  });
          
                  res.json({
                      ok: true,
                      tipo_cita,
                      total: totalTipoCitas
                  });
              } catch (error) {
                  console.error(error);
                  res.status(500).json({
                      msg: 'Error en el servidor',
                  });
              }
          };
          */
        this.getTipoCita = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const medico = yield tipo_cita_1.default.findByPk(id);
                if (!medico) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Tipo de cita no encontrado',
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
        this.crearTipoCita = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { especialidad_medica } = req.body;
            const tipoCitaData = req.body;
            // Quitar acentos y convertir a minúsculas el campo especialidad_medica
            if (especialidad_medica) {
                especialidad_medica = especialidad_medica.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                tipoCitaData.especialidad_medica = especialidad_medica;
            }
            console.log(especialidad_medica);
            try {
                // Comprobar si la especialidad médica activa ya existe
                const existeEspecialidad = yield tipo_cita_1.default.findOne({
                    where: {
                        especialidad_medica: especialidad_medica,
                        estado: 'activo' // Solo considera las especialidades activas
                    }
                });
                if (existeEspecialidad) {
                    return res.status(400).json({
                        ok: false,
                        msg: `La especialidad médica '${especialidad_medica}' ya está registrada y activa.`
                    });
                }
                // Si no existe, crea un nuevo tipo de cita
                const nuevoTipoCita = yield tipo_cita_1.default.create(tipoCitaData);
                res.json({
                    ok: true,
                    tipoCita: nuevoTipoCita,
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
        this.putTipoCita = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { especialidad_medica } = req.body;
            const tipoCitaData = req.body;
            // Quitar acentos y convertir a minúsculas el campo especialidad_medica
            if (especialidad_medica) {
                especialidad_medica = especialidad_medica.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                tipoCitaData.especialidad_medica = especialidad_medica;
            }
            console.log(especialidad_medica);
            try {
                const { id } = req.params;
                const { body } = req;
                // Buscar el médico por su ID
                const medico = yield tipo_cita_1.default.findByPk(id);
                if (!medico) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Tipo de cita no encontrado',
                    });
                }
                // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
                yield medico.update(body);
                res.json({
                    ok: true,
                    msg: 'tipo de cita actualizado correctamente',
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
        this.eliminarHorariosPorEspecialidad = (especialidadMedica) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Encontrar los médicos con la especialidad médica dada y cambiar su estado a inactivo
                yield medico_1.default.update({ estado: 'inactivo' }, {
                    where: { especialidad_medica: especialidadMedica }
                });
                // Encontrar las citas médicas de los médicos con la especialidad dada y cambiar su estado
                // Solo para citas en ciertos estados
                yield cita_medica_1.default.update({ estado_actividad: 'inactivo' }, {
                    where: {
                        rut_medico: {
                            [sequelize_1.Op.in]: sequelize_1.Sequelize.literal(`(SELECT rut FROM medicos WHERE especialidad_medica = '${especialidadMedica}')`)
                        },
                        estado: {
                            [sequelize_1.Op.in]: ['terminado', 'no_pagado', 'no_asistio']
                        }
                    }
                });
                // Encontrar los IDs de los horarios médicos a eliminar
                const horariosParaEliminar = yield horario_medico_1.default.findAll({
                    attributes: ['idHorario'],
                    include: [{
                            model: medico_1.default,
                            as: 'medico',
                            where: { especialidad_medica: especialidadMedica }
                        }]
                });
                // Mapear los horarios para obtener los IDs
                const idsHorariosParaEliminar = horariosParaEliminar.map(horario => horario.idHorario);
                // Eliminar los horarios médicos
                if (idsHorariosParaEliminar.length > 0) {
                    yield horario_medico_1.default.destroy({
                        where: {
                            idHorario: {
                                [sequelize_1.Op.in]: idsHorariosParaEliminar
                            }
                        }
                    });
                }
            }
            catch (error) {
                console.error('Error al cambiar el estado de médicos y citas médicas:', error);
                throw new Error('Error al cambiar el estado de médicos y citas médicas');
            }
        });
        this.deleteTipoCita = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const tipoCita = yield tipo_cita_1.default.findByPk(id);
                if (!tipoCita) {
                    return res.status(404).json({ message: 'Tipo de cita no encontrado' });
                }
                // Guarda la especialidad médica antes de cambiar el estado a inactivo
                const especialidadMedica = tipoCita.especialidad_medica;
                // Cambiar el estado del TipoCita a inactivo
                tipoCita.estado = 'inactivo';
                yield tipoCita.save();
                // Si se desactiva el TipoCita, eliminar los horarios médicos relacionados
                if (especialidadMedica) {
                    yield this.eliminarHorariosPorEspecialidad(especialidadMedica);
                }
                res.status(200).json({ message: 'Tipo de cita desactivado y horarios médicos eliminados con éxito' });
            }
            catch (error) {
                res.status(500).json({ message: 'Error al desactivar el tipo de cita', error });
            }
        });
        this.getEspecialidades = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const especialidades = yield tipo_cita_1.default.findAll({
                    attributes: ['especialidad_medica'],
                    where: {
                        especialidad_medica: {
                            [sequelize_1.Op.ne]: null // Esto excluye las entradas donde especialidad_medica es NULL
                        },
                        estado: 'activo' // Añade esta línea para incluir solo los tipos de cita activos
                    },
                    group: ['especialidad_medica']
                });
                res.json({ especialidades });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    ok: false,
                    msg: 'Hable con el administrador',
                });
            }
        });
        /*
            getEspecialidades = async(req: Request, res: Response) => {
              try {
                  const especialidades = await TipoCita.findAll({
                      attributes: ['especialidad_medica'],
                      where: {
                          especialidad_medica: {
                              [Op.ne]: null // Esto excluye las entradas donde especialidad_medica es NULL
                          }
                      },
                      group: ['especialidad_medica']
                  });
                  
                  res.json({ especialidades });
              } catch (error) {
                  console.error(error);
                  res.status(500).json({
                      ok: false,
                      msg: 'Hable con el administrador',
                  });
              }
            };
         */
    }
    static get instance() {
        return this._instance || (this._instance = new tipo_cita());
    }
}
exports.default = tipo_cita;
//# sourceMappingURL=tipo_cita.js.map