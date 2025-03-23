
import { Request, Response } from 'express';
import TipoCita from '../models/tipo_cita';
import CitaMedica from '../models/cita_medica';
import { Op, Sequelize } from 'sequelize';
import HorarioMedic from '../models/horario_medico';
import Medico from '../models/medico';



export default class tipo_cita {
    private static _instance: tipo_cita;
   

    public static get instance() {
        return this._instance || (this._instance = new tipo_cita());
    }

    getTipoCitas = async (req: Request, res: Response) => {
   
        try {
            const desde = Number(req.query.desde) || 0;
    
            // Obtén el total de tipo de citas activas
            const totalTipoCitas = await TipoCita.count({
                where: { estado: 'activo' } // Filtra para contar solo las citas activas
            });
    
            // Obtén los detalles de todos los tipos de citas activas con paginación
            const tipo_cita = await TipoCita.findAll({
                where: { estado: 'activo' }, // Filtra para obtener solo las citas activas
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



        getTipoCita = async( req: Request , res: Response ) => {
            const { id } = req.params;


        try {
            const medico = await TipoCita.findByPk(id);

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
        } catch (error) {
            console.log(error);
            res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
            });
        }
        };

  
        

        crearTipoCita = async (req: Request, res: Response) => {
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
                const existeEspecialidad = await TipoCita.findOne({
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
                const nuevoTipoCita = await TipoCita.create(tipoCitaData);
        
                res.json({
                    ok: true,
                    tipoCita: nuevoTipoCita,
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    ok: false,
                    msg: 'Hable con el administrador',
                });
            }
        };
        
      
        
        
      



          public putTipoCita = async (req: Request, res: Response) => {
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
              const medico = await TipoCita.findByPk(id);
        
              if (!medico) {
                return res.status(404).json({
                  ok: false,
                  msg: 'Tipo de cita no encontrado',
                });
              }
        
              // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
              await medico.update(body);
        
              res.json({
                ok: true,
                msg: 'tipo de cita actualizado correctamente',
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
        

          public eliminarHorariosPorEspecialidad = async (especialidadMedica:any) => {
            try {
                // Encontrar los médicos con la especialidad médica dada y cambiar su estado a inactivo
                await Medico.update({ estado: 'inactivo' }, {
                    where: { especialidad_medica: especialidadMedica }
                });
        
                // Encontrar las citas médicas de los médicos con la especialidad dada y cambiar su estado
                // Solo para citas en ciertos estados
                await CitaMedica.update({ estado_actividad: 'inactivo' }, {
                    where: {
                        rut_medico: {
                            [Op.in]: Sequelize.literal(`(SELECT rut FROM medicos WHERE especialidad_medica = '${especialidadMedica}')`)
                        },
                        estado: {
                            [Op.in]: ['terminado', 'no_pagado', 'no_asistio']
                        }
                    }
                });
        
                // Encontrar los IDs de los horarios médicos a eliminar
                const horariosParaEliminar = await HorarioMedic.findAll({
                    attributes: ['idHorario'],
                    include: [{
                        model: Medico,
                        as: 'medico',
                        where: { especialidad_medica: especialidadMedica }
                    }]
                });
        
                // Mapear los horarios para obtener los IDs
                const idsHorariosParaEliminar = horariosParaEliminar.map(horario => horario.idHorario);
        
                // Eliminar los horarios médicos
                if (idsHorariosParaEliminar.length > 0) {
                    await HorarioMedic.destroy({
                        where: {
                            idHorario: {
                                [Op.in]: idsHorariosParaEliminar
                            }
                        }
                    });
                }
            } catch (error) {
                console.error('Error al cambiar el estado de médicos y citas médicas:', error);
                throw new Error('Error al cambiar el estado de médicos y citas médicas');
            }
        };
        
        
        
        
        
          public deleteTipoCita = async (req: Request, res: Response) => {
            const { id } = req.params;
        
            try {
                const tipoCita = await TipoCita.findByPk(id);
                if (!tipoCita) {
                    return res.status(404).json({ message: 'Tipo de cita no encontrado' });
                }
        
                // Guarda la especialidad médica antes de cambiar el estado a inactivo
                const especialidadMedica = tipoCita.especialidad_medica;
        
                // Cambiar el estado del TipoCita a inactivo
                tipoCita.estado = 'inactivo';
                await tipoCita.save();
        
                // Si se desactiva el TipoCita, eliminar los horarios médicos relacionados
                if (especialidadMedica) {
                    await this.eliminarHorariosPorEspecialidad(especialidadMedica);
                }
        
                res.status(200).json({ message: 'Tipo de cita desactivado y horarios médicos eliminados con éxito' });
            } catch (error) {
                res.status(500).json({ message: 'Error al desactivar el tipo de cita', error });
            }
        };

      

getEspecialidades = async(req: Request, res: Response) => {
    try {
        const especialidades = await TipoCita.findAll({
            attributes: ['especialidad_medica'],
            where: {
                especialidad_medica: {
                    [Op.ne]: null // Esto excluye las entradas donde especialidad_medica es NULL
                },
                estado: 'activo' // Añade esta línea para incluir solo los tipos de cita activos
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