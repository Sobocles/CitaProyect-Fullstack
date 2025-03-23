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
const horario_clinica_1 = __importDefault(require("../models/horario_clinica"));
const horario_medico_1 = __importDefault(require("../models/horario_medico"));
const info_clinica_1 = __importDefault(require("../models/info-clinica"));
const medico_1 = __importDefault(require("../models/medico"));
class Horario_clinica {
    constructor() {
        //este metodo se activa para ver el horario de la clinica en el menu de inicio de paciente
        this.obtenerHorariosClinica = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
                const horariosClinica = [];
                // Obtener todos los horarios médicos con médicos activos
                const horarios = yield horario_medico_1.default.findAll({
                    include: [{
                            model: medico_1.default,
                            as: 'medico',
                            where: { estado: 'activo' },
                            attributes: []
                        }]
                });
                for (const dia of dias) {
                    // Filtrar los horarios por día
                    const horariosDelDia = horarios.filter(horario => horario.diaSemana === dia);
                    // Determinar si el día está abierto o cerrado
                    const estaAbierto = horariosDelDia.length > 0;
                    if (estaAbierto) {
                        // Calcular horario de apertura y cierre
                        const horarioApertura = horariosDelDia.reduce((min, h) => h.horaInicio < min ? h.horaInicio : min, '23:59');
                        const horarioCierre = horariosDelDia.reduce((max, h) => h.horaFinalizacion > max ? h.horaFinalizacion : max, '00:00');
                        horariosClinica.push({
                            dia,
                            horarioApertura,
                            horarioCierre,
                            estado: 'abierto'
                        });
                    }
                    else {
                        // Marcar el día como cerrado
                        horariosClinica.push({
                            dia,
                            estado: 'cerrado'
                        });
                    }
                }
                return res.json({
                    ok: true,
                    horariosClinica
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    ok: false,
                    msg: 'Error inesperado al obtener los horarios. Por favor, revisa los logs.'
                });
            }
        });
        this.getHorarioClinica = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const horario_clinica = yield horario_clinica_1.default.findByPk(id);
                if (!horario_clinica) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Horario clinica no encontrado',
                    });
                }
                res.json({
                    ok: true,
                    horario_clinica,
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
        this.CrearHorarioClinica = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const horario_clinica = req.body;
            try {
                // Verifica si ya existe un médico con el mismo ID
                const horario_clinica_Existente = yield horario_clinica_1.default.findByPk(horario_clinica.id);
                if (horario_clinica_Existente) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe un Horario clinica con el mismo ID',
                    });
                }
                // Crea un nuevo médico
                const nuevo_horario_clinica = yield horario_clinica_1.default.create(horario_clinica);
                res.json({
                    ok: true,
                    historial: nuevo_horario_clinica,
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
        this.putHorarioClinica = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { body } = req;
                // Buscar el médico por su ID
                const horario_clinica = yield horario_clinica_1.default.findByPk(id);
                if (!horario_clinica) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Horario clinica no encontrado',
                    });
                }
                // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
                yield horario_clinica.update(body);
                res.json({
                    ok: true,
                    msg: 'Horario clinica actualizado correctamente',
                    horario_clinica,
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
        this.deleteHorarioClinica = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const horario_clinica = yield horario_clinica_1.default.findByPk(id);
                if (!horario_clinica) {
                    return res.status(404).json({
                        msg: 'No existe un Horario clinica con el id ' + id,
                    });
                }
                yield horario_clinica.destroy();
                res.json({ msg: 'Horario clinica eliminado correctamente' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    msg: 'Error en el servidor',
                });
            }
        });
        this.getInfoClinica = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtén los detalles de todos los médicos
                const Info = yield info_clinica_1.default.findAll({});
                res.json({
                    ok: true,
                    Info,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    msg: 'Error en el servidor',
                });
            }
        });
        this.crearInfoClinica = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Verifica si ya existe información de la clínica
                const existeInfo = yield info_clinica_1.default.findOne();
                if (existeInfo) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe información de la clínica. No se puede crear más de una, si desea cambiar la informacion de la clinica, porfacor elimine la informacion que ya existe e ingrese otra informacion.'
                    });
                }
                // Crea la nueva información de la clínica
                const { nombreClinica, direccion, telefono, email } = req.body;
                console.log(nombreClinica, direccion, telefono, email);
                const nuevaInfo = yield info_clinica_1.default.create({ nombreClinica, direccion, telefono, email });
                res.json({
                    ok: true,
                    msg: 'Información de la clínica creada con éxito',
                    nuevaInfo
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    msg: 'Error en el servidor al crear la información de la clínica'
                });
            }
        });
        /*
              public async obtenerEspecialidadesPorDia(req: Request, res: Response) {
               try {
                 const horarios: HorarioConEspecialidad[] = await HorarioMedic.findAll({
                   include: [{
                     model: Medico,
                     attributes: ['especialidad_medica'],
                     as: 'medico'
                   }],
                   attributes: ['diaSemana'],
                   group: ['diaSemana', 'medico.especialidad_medica'],
                   order: [['diaSemana', 'ASC']],
                   raw: true,
                 }) as unknown as HorarioConEspecialidad[];
             
                 const especialidadesPorDia: {[key: string]: string[]} = {};
                 horarios.forEach(horario => {
                   const dia = horario.diaSemana;
                   const especialidad = horario['medico.especialidad_medica'];
             
                   if (!especialidadesPorDia[dia]) {
                     especialidadesPorDia[dia] = [];
                   }
             
                   if (especialidad && !especialidadesPorDia[dia].includes(especialidad)) {
                     especialidadesPorDia[dia].push(especialidad);
                   }
                 });
             
                 const ordenDias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
                 const especialidadesOrdenadas: {[key: string]: string[]} = {};
             
                 ordenDias.forEach(dia => {
                   if (especialidadesPorDia[dia]) {
                     especialidadesOrdenadas[dia] = especialidadesPorDia[dia];
                   }
                 });
             
                 res.json(especialidadesOrdenadas);
               } catch (error) {
                 res.status(500).send({ message: 'Error al obtener las especialidades por día' });
               }
             }
        
       
       
        */
        this.deleteInfoClinica = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // Obtener el nombre de la clínica del parámetro de la ruta
                // Buscar y eliminar la información de la clínica por su nombre
                const resultado = yield info_clinica_1.default.destroy({
                    where: { id }
                });
                if (resultado === 0) {
                    return res.status(404).json({
                        ok: false,
                        mensaje: 'Información de clínica no encontrada'
                    });
                }
                res.status(200).json({
                    ok: true,
                    mensaje: 'Información de la clínica eliminada con éxito'
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    ok: false,
                    mensaje: 'Error al eliminar la información de la clínica'
                });
            }
        });
    }
    static get instance() {
        return this._instance || (this._instance = new Horario_clinica());
    }
    obtenerEspecialidadesPorDia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const horarios = yield horario_medico_1.default.findAll({
                    include: [{
                            model: medico_1.default,
                            attributes: ['especialidad_medica'],
                            as: 'medico',
                            where: {
                                estado: 'activo' // Solo incluye médicos activos
                            }
                        }],
                    attributes: ['diaSemana'],
                    group: ['diaSemana', 'medico.especialidad_medica'],
                    order: [['diaSemana', 'ASC']],
                    raw: true,
                });
                const especialidadesPorDia = {};
                horarios.forEach(horario => {
                    const dia = horario.diaSemana;
                    const especialidad = horario['medico.especialidad_medica'];
                    if (!especialidadesPorDia[dia]) {
                        especialidadesPorDia[dia] = [];
                    }
                    if (especialidad && !especialidadesPorDia[dia].includes(especialidad)) {
                        especialidadesPorDia[dia].push(especialidad);
                    }
                });
                const ordenDias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
                const especialidadesOrdenadas = {};
                ordenDias.forEach(dia => {
                    if (especialidadesPorDia[dia]) {
                        especialidadesOrdenadas[dia] = especialidadesPorDia[dia];
                    }
                });
                res.json(especialidadesOrdenadas);
            }
            catch (error) {
                res.status(500).send({ message: 'Error al obtener las especialidades por día' });
            }
        });
    }
}
exports.default = Horario_clinica;
//# sourceMappingURL=horario_clinica.js.map