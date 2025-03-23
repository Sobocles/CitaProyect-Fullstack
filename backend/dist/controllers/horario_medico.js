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
const medico_1 = __importDefault(require("../models/medico"));
const horario_medico_1 = __importDefault(require("../models/horario_medico"));
const sequelize_1 = require("sequelize");
class HorarioMedico {
    constructor() {
        /*
              idHorario!: number; // El signo de interrogación indica que es opcional, ya que se autoincrementa en la base de datos
          diaSemana!: string;
          horaInicio!: string;
          horaFinalizacion!: string;
          hora_inicio_colacion?: string;
          hora_fin_colacion?: string;
          duracionCitas!: number;
          rut_medico!: string;
          disponibilidad!: boolean;
          fechaCreacion!: Date;
          }
        
        
        */
        // Suponiendo que esta es la función para obtener los horarios médicos
        this.getHorariosMedicos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const desde = Number(req.query.desde) || 0;
                // Obtén el total de horarios de médicos activos
                const totalHorarios = yield horario_medico_1.default.count({
                    include: [{
                            model: medico_1.default,
                            as: 'medico',
                            where: { estado: 'activo' } // Contar solo horarios de médicos activos
                        }]
                });
                // Obtén los detalles de todos los horarios de médicos activos
                const horarios = yield horario_medico_1.default.findAll({
                    include: [{
                            model: medico_1.default,
                            as: 'medico',
                            attributes: ['nombre', 'apellidos', 'especialidad_medica'],
                            where: { estado: 'activo' } // Filtrar por médicos activos
                        }],
                    offset: desde,
                    limit: 5,
                });
                res.json({
                    ok: true,
                    horarios,
                    total: totalHorarios,
                });
            }
            catch (error) {
                console.error('Error al obtener horario:', error);
                res.status(500).json({
                    msg: 'Error en el servidor',
                });
            }
        });
        /*
        
        
        getHorariosMedicos = async (req: Request, res: Response) => {
          console.log('aqui estoy obteniendo los horarios medicos');
          try {
              const desde = Number(req.query.desde) || 0;
              const especialidadesValidas = await TipoCita.findAll({
                  attributes: ['especialidad_medica']
              });
              const especialidades = especialidadesValidas.map(ec => ec.especialidad_medica);
        
              // Obtén el total de horarios de médicos
              const totalHorarios = await HorarioMedic.count();
        
              // Obtén los detalles de todos los horarios de médicos con paginación
              const horarios = await HorarioMedic.findAll({
                  include: [
                      {
                          model: Medico,
                          as: 'medico',
                          attributes: ['nombre', 'apellidos', 'especialidad_medica'],
                          where: {
                              especialidad_medica: {
                                  [Op.in]: especialidades
                              }
                          }
                      }
                  ],
                  offset: desde,
                  limit: 5,
              });
        
              // Filtrar horarios para excluir especialidades no válidas
              const horariosFiltrados = horarios.map(horario => {
                // Verifica si medico es undefined antes de acceder a sus propiedades
                if (horario.medico && !especialidades.includes(horario.medico.especialidad_medica)) {
                  // Si medico no es undefined y su especialidad_medica no está en la lista de especialidades válidas, elimínala
                  delete horario.medico.dataValues.especialidad_medica;
                }
                return horario;
              });
        
              res.json({
                  ok: true,
                  horarios: horariosFiltrados,
                  total: totalHorarios,
              });
          } catch (error) {
              console.error('Error al obtener horario:', error);
              res.status(500).json({
                  msg: 'Error en el servidor',
              });
          }
        };
        
        
        */
        this.getHorarioMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const horario = yield horario_medico_1.default.findByPk(id);
                if (!horario) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Médico no encontrado',
                    });
                }
                res.json({
                    ok: true,
                    horario,
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
        this.CrearHorarioMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { diaSemana, horaInicio, horaFinalizacion, rut_medico, inicio_colacion, fin_colacion } = req.body;
            try {
                // Buscar horarios existentes que puedan solaparse
                const horariosExistentes = yield horario_medico_1.default.findAll({
                    where: {
                        rut_medico,
                        diaSemana,
                        [sequelize_1.Op.or]: [
                            {
                                horaInicio: {
                                    [sequelize_1.Op.lt]: horaFinalizacion,
                                    [sequelize_1.Op.ne]: horaFinalizacion
                                },
                                horaFinalizacion: {
                                    [sequelize_1.Op.gt]: horaInicio
                                }
                            },
                            {
                                horaInicio: {
                                    [sequelize_1.Op.lt]: horaFinalizacion
                                },
                                horaFinalizacion: {
                                    [sequelize_1.Op.gt]: horaInicio,
                                    [sequelize_1.Op.ne]: horaInicio
                                }
                            }
                        ]
                    }
                });
                if (horariosExistentes.length > 0) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya tienes registrado a este mismo medico en la mismo dia y hora en el registro de horarios medicos. por favor revise el horario de sus medicos para evitar solapamiento de horarios de un mismo medico, (las hora de inicio y finalizacion no pueden ser las mismas o estar solapadas con el mismo medico en el mismo dia)'
                    });
                }
                const nuevoHorario = yield horario_medico_1.default.create({ diaSemana, horaInicio, horaFinalizacion, rut_medico, inicio_colacion, fin_colacion });
                res.json({
                    ok: true,
                    diaSemana,
                    horaInicio,
                    horaFinalizacion,
                    rut_medico,
                    inicio_colacion,
                    fin_colacion
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    ok: false,
                    msg: 'Hable con el administrador'
                });
            }
        });
        this.putHorarioMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { body } = req;
                // Buscar el médico por su ID
                const horarioMedico = yield horario_medico_1.default.findByPk(id);
                if (!horarioMedico) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Horario medico no encontrado',
                    });
                }
                // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
                yield horarioMedico.update(body);
                res.json({
                    ok: true,
                    msg: 'Horario medico actualizado correctamente',
                    horarioMedico,
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
        this.deleteHorarioMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const HorarioMedico = yield horario_medico_1.default.findByPk(id);
                if (!HorarioMedico) {
                    return res.status(404).json({
                        msg: 'No existe un horario medico con el id ' + id,
                    });
                }
                yield HorarioMedico.destroy();
                res.json({ msg: 'horario medico eliminado correctamente' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    msg: 'Error en el servidor',
                });
            }
        });
    }
    static get instance() {
        return this._instance || (this._instance = new HorarioMedico());
    }
}
exports.default = HorarioMedico;
//# sourceMappingURL=horario_medico.js.map