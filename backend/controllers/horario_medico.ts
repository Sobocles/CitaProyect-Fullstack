import { Request, Response } from 'express';
import Medico from '../models/medico';
import bcrypt from 'bcrypt';
import HorarioMedic from '../models/horario_medico';
import { DataTypes, Op } from 'sequelize';
import TipoCita from '../models/tipo_cita';



export default class HorarioMedico {
    private static _instance: HorarioMedico;

    public static get instance() {
        return this._instance || (this._instance = new HorarioMedico());
    }


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
getHorariosMedicos = async (req: Request, res: Response) => {
  
  try {
      const desde = Number(req.query.desde) || 0;

      // Obtén el total de horarios de médicos activos
      const totalHorarios = await HorarioMedic.count({
          include: [{
              model: Medico,
              as: 'medico',
              where: { estado: 'activo' } // Contar solo horarios de médicos activos
          }]
      });

      // Obtén los detalles de todos los horarios de médicos activos
      const horarios = await HorarioMedic.findAll({
          include: [{
              model: Medico,
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
  } catch (error) {
      console.error('Error al obtener horario:', error);
      res.status(500).json({
          msg: 'Error en el servidor',
      });
  }
};



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
        getHorarioMedico = async( req: Request , res: Response ) => {
          const { id } = req.params;
         

      try {
          const horario = await HorarioMedic.findByPk(id);

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
      } catch (error) {
          console.log(error);
          res.status(500).json({
          ok: false,
          msg: 'Hable con el administrador',
          });
      }
      };

        

      CrearHorarioMedico = async(req: Request, res: Response) => {
        const { diaSemana, horaInicio, horaFinalizacion, rut_medico, inicio_colacion, fin_colacion } = req.body;


        try {
          // Buscar horarios existentes que puedan solaparse
          const horariosExistentes = await HorarioMedic.findAll({
            where: {
              rut_medico,
              diaSemana,
              [Op.or]: [
                {
                  horaInicio: {
                    [Op.lt]: horaFinalizacion,
                    [Op.ne]: horaFinalizacion
                  },
                  horaFinalizacion: {
                    [Op.gt]: horaInicio
                  }
                },
                {
                  horaInicio: {
                    [Op.lt]: horaFinalizacion
                  },
                  horaFinalizacion: {
                    [Op.gt]: horaInicio,
                    [Op.ne]: horaInicio
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
          
      
          const nuevoHorario = await HorarioMedic.create({ diaSemana, horaInicio, horaFinalizacion, rut_medico, inicio_colacion, fin_colacion  });
          res.json({
            ok: true,
            diaSemana, 
            horaInicio, 
            horaFinalizacion, 
            rut_medico, 
            inicio_colacion, // Añadir esta línea
            fin_colacion 
          });
      
        } catch (error) {
          console.log(error);
          res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
          });
        }
      };
      
      
      
      
      



          public putHorarioMedico = async (req: Request, res: Response) => {
            try {
              const { id } = req.params;
              const { body } = req;

        
              // Buscar el médico por su ID
              const horarioMedico = await HorarioMedic.findByPk(id);
        
              if (!horarioMedico) {
                return res.status(404).json({
                  ok: false,
                  msg: 'Horario medico no encontrado',
                });
              }
        
              // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
              await horarioMedico.update(body);
        
              res.json({
                ok: true,
                msg: 'Horario medico actualizado correctamente',
                horarioMedico,
              });
            } catch (error) {
              console.error(error);
              res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador',
              });
            }
          };
        



          public deleteHorarioMedico = async (req: Request, res: Response) => {
            const { id } = req.params;
          
            try {
              const HorarioMedico = await HorarioMedic.findByPk(id);
          
              if (!HorarioMedico) {
                return res.status(404).json({
                  msg: 'No existe un horario medico con el id ' + id,
                });
              }
          
              await HorarioMedico.destroy();
          
              res.json({ msg: 'horario medico eliminado correctamente' });
            } catch (error) {
              console.error(error);
              res.status(500).json({
                msg: 'Error en el servidor',
              });
            }
         
      }
}