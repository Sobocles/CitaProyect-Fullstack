
import { Request, Response } from 'express';
import CitaMedica from '../models/cita_medica';
import Usuario from '../models/usuario';
import Medico from '../models/medico';
import TipoCita from '../models/tipo_cita';
import { Op } from 'sequelize';
import Factura from '../models/factura';

export default class Cita {
    private static _instance: Cita;

    public static get instance() {
        return this._instance || (this._instance = new Cita());
    }
    
    public getCitas = async (req: Request, res: Response) => {
        try {
            const desde = Number(req.query.desde) || 0;
    
            // Obtén el total de citas activas que no estén en estado 'no_pagado'
            const totalCitas = await CitaMedica.count({
                where: {
                    estado_actividad: 'activo',
                    estado: { [Op.ne]: 'no_pagado' } // Excluye las citas con estado 'no_pagado'
                }
            });
    
            const citas = await CitaMedica.findAll({
                include: [
                    {
                        model: Usuario,
                        as: 'paciente',
                        attributes: ['nombre', 'apellidos'],
                    },
                    {
                        model: Medico,
                        as: 'medico',
                        attributes: ['nombre','apellidos'],
                    },
                    {
                        model: TipoCita,
                        as: 'tipoCita',
                        attributes: ['especialidad_medica'],
                    },
                ],
                where: {
                    estado_actividad: 'activo',
                    estado: { [Op.ne]: 'no_pagado' } // Excluye las citas con estado 'no_pagado'
                },
                attributes: ['idCita', 'motivo', 'fecha', 'hora_inicio', 'hora_fin', 'estado'],
                offset: desde,
                limit: 5,
            });
    
            res.json({
                ok: true,
                citas,
                total: totalCitas
            });
        } catch (error) {
            console.error('Error al obtener citas:', error);
            res.status(500).json({ error: 'Error al obtener citas' });
        }
    };
    
 
  /*
  public getCitas = async (req: Request, res: Response) => {
      try {
          const desde = Number(req.query.desde) || 0;
  
          // Obtén el total de citas
          const totalCitas = await CitaMedica.count();
  
          const citas = await CitaMedica.findAll({
              include: [
                  {
                      model: Usuario, // Modelo de Usuario (paciente)
                      as: 'paciente', // Alias definido en la asociación
                      attributes: ['nombre'], // Nombre del paciente
                  },
                  {
                      model: Medico, // Modelo de Usuario (médico)
                      as: 'medico', // Alias definido en la asociación
                      attributes: ['nombre'], // Nombre del médico
                  },
                  {
                      model: TipoCita, // Modelo de TipoCita
                      as: 'tipoCita', // Alias definido en la asociación
                      attributes: ['especialidad_medica'], // Tipo de cita
                  },
              ],
              attributes: ['idCita', 'motivo', 'fecha', 'hora_inicio', 'hora_fin', 'estado'], // Otros atributos de CitaMedica
              offset: desde, // Offset para la paginación
              limit: 5, // Límite de registros por página
          });
  
          res.json({
              ok: true,
              citas,
              total: totalCitas
          });
      } catch (error) {
          console.error('Error al obtener citas:', error);
          res.status(500).json({ error: 'Error al obtener citas' });
      }
  };

  */
    

  public getCitasMedico = async (req: Request, res: Response) => {
    const { rut_medico } = req.params;
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;

    try {
        // Contar total de citas activas para este médico
        const totalCitas = await CitaMedica.count({
            where: {
                rut_medico: rut_medico,
                estado: {
                    [Op.or]: ['en_curso', 'pagado','terminado']
                },
                estado_actividad: 'activo' // Solo considerar citas activas
            }
        });

        // Obtener las citas activas con paginación y detalles de paciente y médico
        const citas = await CitaMedica.findAll({
            where: {
                rut_medico: rut_medico,
                estado: {
                    [Op.or]: ['en_curso', 'pagado','terminado']
                },
                estado_actividad: 'activo' // Solo considerar citas activas
            },
            include: [
                {
                    model: Usuario,
                    as: 'paciente',
                    attributes: ['nombre', 'apellidos']
                },
                {
                    model: Medico,
                    as: 'medico',
                    attributes: ['nombre', 'apellidos']
                }
            ],
            attributes: { exclude: ['rut_paciente', 'rut_medico'] },
            offset: desde,
            limit: limite
        });

        if (!citas || citas.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron citas activas para este médico',
            });
        }

        res.json({
            ok: true,
            citas,
            total: totalCitas
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor',
        });
    }
};
/*
  public getCitasMedico = async (req: Request, res: Response) => {
    const { rut_medico } = req.params;
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;

    try {
        // Contar total de citas para este médico
        const totalCitas = await CitaMedica.count({
            where: {
                rut_medico: rut_medico,
                estado: {
                    [Op.or]: ['en_curso', 'pagado']
                }
            }
        });

        // Obtener las citas con paginación y detalles de paciente y médico
        const citas = await CitaMedica.findAll({
            where: {
                rut_medico: rut_medico,
                estado: {
                    [Op.or]: ['en_curso', 'pagado']
                }
            },
            include: [
                {
                    model: Usuario, // Modelo del paciente
                    as: 'paciente', // Alias del paciente
                    attributes: ['nombre', 'apellidos'] // Atributos del paciente
                },
                {
                    model: Medico, // Modelo del médico
                    as: 'medico', // Alias del médico
                    attributes: ['nombre', 'apellidos'] // Atributos del médico
                }
            ],
            attributes: { exclude: ['rut_paciente', 'rut_medico'] },
            offset: desde,
            limit: limite
        });

        if (!citas || citas.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron citas para este médico',
            });
        }

        res.json({
            ok: true,
            citas,
            total: totalCitas
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor',
        });
    }
};

*/

public getCitasPaciente = async (req: Request, res: Response) => {
    const { rut_paciente } = req.params;
    console.log('aqui esta el rut',rut_paciente);
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;

    try {
        // Contar total de citas activas para este paciente
        const totalCitas = await CitaMedica.count({
            where: {
                rut_paciente: rut_paciente,
                estado: {
                    [Op.or]: ['en_curso', 'pagado', 'terminado']
                },
                estado_actividad: 'activo' // Solo considerar citas activas
            }
        });

        // Obtener las citas activas con paginación y detalles de médico y paciente
        const citas = await CitaMedica.findAll({
            where: {
                rut_paciente: rut_paciente,
                estado: {
                    [Op.or]: ['en_curso', 'pagado', 'terminado']
                },
                estado_actividad: 'activo' // Solo considerar citas activas
            },
            include: [
                {
                    model: Usuario,
                    as: 'paciente',
                    attributes: ['nombre', 'apellidos']
                },
                {
                    model: Medico,
                    as: 'medico',
                    attributes: ['nombre', 'apellidos']
                }
            ],
            attributes: { exclude: ['rut_paciente', 'rut_medico'] },
            offset: desde,
            limit: limite
        });

        if (!citas || citas.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron citas activas para este paciente',
            });
        }

        res.json({
            ok: true,
            citas,
            total: totalCitas
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor',
        });
    }
};



getCitaFactura = async (req: Request, res: Response) => {
    const idCita = parseInt(req.params.idCita);
  
    if (!idCita) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Es necesario el ID de la cita médica'
        });
    }

    try {
        const citaMedica = await CitaMedica.findOne({
            where: { idCita },
            include: [
                {
                    model: Factura,
                    as: 'factura',
                    required: false  // Esto es para permitir citas sin factura
                },
                {
                    model: Medico,
                    as: 'medico',
                    attributes: ['nombre', 'apellidos', 'especialidad_medica']  // Solo incluir los atributos necesarios
                },
                {
                    model: Usuario,
                    as: 'paciente',
                    attributes: ['nombre', 'apellidos', 'email']  // Solo incluir los atributos necesarios
                },
               
            ]
        });
    

        if (!citaMedica) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Cita médica no encontrada'
            });
        }

        return res.json({
            ok: true,
            citaMedica
        });
    } catch (error) {
      
        if (error instanceof Error) {
            console.error('Error al obtener la cita médica y su factura:', error.message);
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al obtener la cita médica y su factura',
                error: error.message
            });
        } else {
            // 
            console.error('Error inesperado al obtener la cita médica y su factura');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error inesperado al obtener la cita médica y su factura'
            });
        }
    }
};



/*

getCitaFactura = async (req: Request, res: Response) => {
    const idCita = parseInt(req.params.idCita);
  
    if (!idCita) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Es necesario el ID de la cita médica'
        });
    }

    try {
        const citaMedica = await CitaMedica.findOne({
            where: { idCita },
            include: [
                {
                    model: Factura,
                    as: 'factura',
                    required: false  // Esto es para permitir citas sin factura
                },
                {
                    model: Medico,
                    as: 'medico',
                    attributes: ['nombre', 'apellidos', 'especialidad_medica']  // Solo incluir los atributos necesarios
                },
                {
                    model: Usuario,
                    as: 'paciente',
                    attributes: ['nombre', 'apellidos', 'email']  // Solo incluir los atributos necesarios
                },
                // Puedes incluir más asociaciones si son necesarias
            ]
        });
    

        if (!citaMedica) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Cita médica no encontrada'
            });
        }

        return res.json({
            ok: true,
            citaMedica
        });
    } catch (error) {
      
        if (error instanceof Error) {
            console.error('Error al obtener la cita médica y su factura:', error.message);
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al obtener la cita médica y su factura',
                error: error.message
            });
        } else {
            // 
            console.error('Error inesperado al obtener la cita médica y su factura');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error inesperado al obtener la cita médica y su factura'
            });
        }
    }
};


*/


        

        public crearCita = async( req: Request, res: Response ) => {

          let citaData = req.body.cita; 

          try {
   
              const citaExistente = await CitaMedica.findByPk(citaData.idCita);
                  
              if (citaExistente) {
                  return res.status(400).json({
                      ok: false,
                      msg: 'Ya existe una cita con el mismo ID',
                  });
              }
                  
              // Crea una nueva cita
              const nuevaCita = await CitaMedica.create(citaData);
                  
              res.json({
                  ok: true,
                  cita: nuevaCita,
              });
          } catch (error) {
              console.log(error);
              res.status(500).json({
                  ok: false,
                  msg: 'Hable con el administrador',
              });
          }
      };
/*
      public crearCita = async(req: Request, res: Response) => {
        const { fecha, ...datosCita } = req.body;
      
        try {
          const fechaCita = new Date(fecha + 'T00:00:00'); // Asegura que la fecha se interpreta en la zona horaria local
          const diaDeLaSemana = fechaCita.getDay();
          const nombreDia = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][diaDeLaSemana];
      
          const medicosDisponibles = await HorarioMedic.findAll({
            where: {
              diaSemana: nombreDia,
              // Otras condiciones si son necesarias
            }
          });
      
          if (medicosDisponibles.length === 0) {
            return res.status(400).json({
              ok: false,
              msg: `No hay médicos disponibles el día ${nombreDia}, por favor revisa el horario de tus medicos para seleccionar un día en que un médico trabaje.`
            });
          }
      
          // Volver a incluir la fecha en datosCita
          const datosCitaConFecha = { ...datosCita, fecha };
      
          const citaExistente = await CitaMedica.findByPk(datosCitaConFecha.idCita);
          if (citaExistente) {
            return res.status(400).json({
              ok: false,
              msg: 'Ya existe una cita con el mismo ID',
            });
          }
      
          // Crea una nueva cita
          const nuevaCita = await CitaMedica.create(datosCitaConFecha);
      
          res.json({
            ok: true,
            cita: nuevaCita,
          });
        } catch (error) {
          console.log(error);
          res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
          });
        }
      }; */

      verificarCitasUsuario = async(rut_paciente: string): Promise<boolean> => {
        try {
            const citaExistente = await CitaMedica.findOne({
                where: {
                    rut_paciente,
                    estado: {
                        [Op.or]: ['pagado', 'en_curso']
                    },
                    estado_actividad: 'activo' // Solo considerar citas activas
                }
            });
    
            return !!citaExistente;
        } catch (error) {
            console.error('Error al verificar las citas del usuario:', error);
            throw error; // Manejo del error
        }
    };
    
//ESTE METODO ES CUANDO EL PACIENTE AGENDA UNA CITA
      crearCitaPaciente = async (req: Request, res: Response) => {
       
        const { rutMedico, hora_inicio, hora_fin, idTipoCita, especialidad, rutPaciente, fecha } = req.body;
    
        const puedeAgendar = await this.verificarCitasUsuario(rutPaciente);
    
        if (!puedeAgendar) {
            try {
                // Crea la cita médica con el estado no_pagado
                const cita = await CitaMedica.create({
                    rut_paciente: rutPaciente,
                    rut_medico: rutMedico,
                    fecha: fecha, 
                    hora_inicio,
                    hora_fin,
                    estado: 'no_pagado', 
                    motivo: especialidad, 
                    idTipoCita,
                });
    
              
               
                console.log('Cita creada con ID:', cita.idCita);
                return res.status(201).json({
                    ok: true,
                    cita: {
                        idCita: cita.idCita, 
                        
                    }
                });
            } catch (error) {
                console.error('Error al crear la cita médica:', error);
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al crear la cita médica',
                    error
                });
            }
        } else {
            // Enviar mensaje al usuario informándole que ya tiene una cita programada
            return res.status(400).json({
                ok: false,
                mensaje: "Ya tienes una cita programada. Debes asistir y terminar tu cita actual para agendar otra."
            });
        }
    };
    
      
      
      
      



          public putCita= async (req: Request, res: Response) => {
            try {
              const { id } = req.params;
              const { body } = req;

              // Buscar el médico por su ID
              const cita = await CitaMedica.findByPk(id);
        
              if (!cita) {
                return res.status(404).json({
                  ok: false,
                  msg: 'cita no encontrada',
                });
              }
        
              // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
              await cita.update(body);
        
              res.json({
                ok: true,
                msg: 'Médico actualizado correctamente',
                cita,
              });
            } catch (error) {
              console.error(error);
              res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador',
              });
            }
          };
        



          public deleteCita = async (req: Request, res: Response) => {
            const { id } = req.params;
        
            try {
                const cita = await CitaMedica.findByPk(id);
        
                if (!cita) {
                    return res.status(404).json({
                        msg: 'No existe una cita con el id ' + id,
                    });
                }
        
                // Cambiar el estado de la cita a 'inactivo'
                await cita.update({ estado_actividad: 'inactivo' });
        
                res.json({ msg: 'Cita actualizada a inactivo correctamente' });
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    msg: 'Error en el servidor',
                });
            }
        };
        
}