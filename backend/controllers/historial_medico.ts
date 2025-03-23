
import { Request, Response } from 'express';
import HistorialMedico from '../models/historial_medico';
import bcrypt from 'bcrypt';
import Medico from '../models/medico';
import Usuario from '../models/usuario';
import CitaMedica from '../models/cita_medica';
import { Op } from 'sequelize';



export default class Historial_Medico {
    private static _instance: Historial_Medico;

    public static get instance() {
        return this._instance || (this._instance = new Historial_Medico());
    }

        getHistoriales= async( req: Request , res: Response ) => {
            const historial = await HistorialMedico.findAll();
            console.log(historial);
        
            res.json({ historial });
        }

        

        getHistorial = async (req: Request, res: Response) => {
            const { id } = req.params; // ID del paciente
            console.log('AQUI ESTA EL ID',id);
            
            const desde = Number(req.query.desde) || 0;
            const limite = Number(req.query.limite) || 5;
        
            try {
                // Contar total de historiales activos para este paciente
                const totalHistoriales = await HistorialMedico.count({
                    where: { 
                        rut_paciente: id,
                        estado: 'activo' // Agregando condición para contar solo historiales activos
                    }
                });
        
                // Si no hay historiales activos, devuelve una respuesta vacía
                if (totalHistoriales === 0) {
                    return res.status(200).json({
                        ok: true,
                        msg: 'No hay historiales activos para el paciente',
                        historiales: []
                    });
                }
        
                // Obtener los historiales activos con paginación e incluir el médico activo
                const historiales = await HistorialMedico.findAll({
                    where: { 
                        rut_paciente: id,
                        estado: 'activo' // Asegurarse de obtener solo historiales activos
                    },
                    include: [{
                        model: Medico,
                        as: 'medico', 
                        where: { estado: 'activo' },
                        attributes: ['nombre', 'apellidos'] // Atributos a incluir del médico
                    }],
                    offset: desde,
                    limit: limite,
                    attributes: { exclude: ['rut_medico'] } 
                });
        
                res.json({
                    ok: true,
                    historiales, // Devuelve los historiales médicos activos paginados junto con el médico activo
                    total: totalHistoriales // Total de historiales activos
                });
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    ok: false,
                    msg: 'Hable con el administrador',
                });
            }
        };
        

      getHistorialMedico = async (req: Request, res: Response) => {
        const { id } = req.params; // RUT del médico
        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 5;
    
        try {
            // Contar total de historiales activos escritos por este médico y pacientes activos
            const totalHistoriales = await HistorialMedico.count({
                where: { 
                    rut_medico: id,
                    estado: 'activo' // Solo contar historiales activos
                },
                include: [{
                    model: Usuario,
                    as: 'paciente',
                    where: { estado: 'activo' } // Solo contar si el paciente está activo
                }]
            });
    
            // Si no hay historiales, devuelve una respuesta vacía
            if (totalHistoriales === 0) {
                return res.status(200).json({
                    ok: true,
                    msg: 'No hay historiales activos escritos por el médico para pacientes activos',
                    historiales: []
                });
            }
    
            // Obtener los historiales activos con paginación
            const historiales = await HistorialMedico.findAll({
                where: { 
                    rut_medico: id,
                    estado: 'activo' // Solo obtener historiales activos
                },
                include: [{
                    model: Usuario,
                    as: 'paciente',
                    where: { estado: 'activo' }, // Solo incluir pacientes activos
                    attributes: ['nombre', 'apellidos', 'rut'] // Atributos a incluir del paciente
                }],
                offset: desde,
                limit: limite,
                attributes: { exclude: ['rut_paciente'] } 
            });
    
            res.json({
                ok: true,
                historiales, // Devuelve los historiales médicos activos paginados
                total: totalHistoriales // Total de historiales activos escritos por el médico para pacientes activos
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador',
            });
        }
    };
    
    
      
    CrearHistorial = async(req: Request, res: Response) => {
        const historialData = req.body;
        console.log(historialData);
    
        try {
            // Verifica si ya existe un historial médico con el mismo ID
            const historialExistente = await HistorialMedico.findByPk(historialData.id_historial_medico);
            if (historialExistente) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un historial médico con el mismo ID',
                });
            }
    
            // Encuentra la cita médica relacionada
            const citaRelacionada = await CitaMedica.findOne({
                where: {
                    rut_paciente: historialData.rut_paciente,
                    rut_medico: historialData.rut_medico,
                 
                    estado: {
                        [Op.or]: ['en_curso', 'pagado']
                    }
                }
            });
    
            if (citaRelacionada) {
                // Cambia el estado de la cita a 'terminado'
                citaRelacionada.estado = 'terminado';
                await citaRelacionada.save();
            } else {
                return res.status(404).json({
                    ok: false,
                    msg: 'No se encontró una cita médica relacionada y activa para la fecha y RUTs proporcionados',
                });
            }
    
            // Crea un nuevo historial médico
            const nuevoHistorial = await HistorialMedico.create(historialData);
    
            res.json({
                ok: true,
                historial: nuevoHistorial
            });
    
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado... revisar logs',
            });
        }
    };
        

        
/*
        CrearHistorial= async( req: Request, res: Response ) => {
            const historialData = req.body;
            console.log('Aqui esta el historialdata',historialData);

            try {
              // Verifica si ya existe un médico con el mismo ID
              const historialExistente = await HistorialMedico.findByPk(historialData.id);
          
              if (historialExistente) {
                return res.status(400).json({
                  ok: false,
                  msg: 'Ya existe un historial con el mismo ID',
                });
              }
          
              // Crea un nuevo médico
              const nuevoHistorial = await HistorialMedico.create(historialData);
          
              res.json({
                ok: true,
                historial: nuevoHistorial,
              });
            } catch (error) {
              console.log(error);
              res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador',
              });
            }
          };
      
*/


          public putHistorial = async (req: Request, res: Response) => {
            try {
              const { id } = req.params;
              console.log('aqui esta el id del historial',id);
              const { body } = req;
              console.log('aqui esta ek body del historial',body);
        
              // Buscar el médico por su ID
              const medico = await HistorialMedico.findByPk(id);
        
              if (!medico) {
                return res.status(404).json({
                  ok: false,
                  msg: 'Historial no encontrado no encontrado',
                });
              }
        
              // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
              await medico.update(body);
        
              res.json({
                ok: true,
                msg: 'historial actualizado correctamente',
                medico,
              });
            } catch (error) {
              console.error(error);
              res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador',
              });
            }
          };
        



          public deleteHistorial = async (req: Request, res: Response) => {
            const { id } = req.params;
         
        
            try {
                const historial = await HistorialMedico.findByPk(id);
        
                if (!historial) {
                    return res.status(404).json({
                        msg: 'No existe un historial con el id ' + id,
                    });
                }
        
                // Cambiar el estado del historial a 'inactivo' en lugar de eliminarlo
                historial.estado = 'inactivo';
                await historial.save();
        
                res.json({ msg: 'Historial actualizado a inactivo correctamente' });
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    msg: 'Error en el servidor',
                });
            }
        };

        public getHistorialPorId = async (req: Request, res: Response) => {
          const { id } = req.params;
          console.log('Aqui esta el id',id); 
  
          try {
              const historial = await HistorialMedico.findByPk(id);
  
              if (!historial) {
                  return res.status(404).json({
                      msg: 'No se encontró un historial médico con el ID proporcionado',
                  });
              }
  
              res.json(historial);
          } catch (error) {
              console.error(error);
              res.status(500).json({
                  msg: 'Error al obtener el historial médico',
              });
          }
      };
  
     
  }
        
