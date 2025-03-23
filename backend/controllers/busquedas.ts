import { Request, Response } from 'express';
import Usuario from '../models/usuario';
import Medico from '../models/medico';
import { Op } from 'sequelize'; 
import HorarioMedic from '../models/horario_medico';
import CitaMedica from '../models/cita_medica';
import TipoCita from '../models/tipo_cita';
import Factura from '../models/factura';
import HistorialMedico from '../models/historial_medico';



export const getDocumentosColeccion = async (req: Request, res: Response) => {
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    console.log('AQUI ESTA LA TABLA',tabla);
      
    let data: any[] = [];
  
    switch (tabla) {
        case 'usuarios':
            data = await Usuario.findAll({
                attributes: ['rut', 'nombre', 'apellidos', 'email', 'fecha_nacimiento', 'telefono', 'direccion', 'rol'],
                where: {
                    nombre: {
                        [Op.like]: `%${busqueda}%`
                    },
                    estado: 'activo' 
                }
            });
            break;
        
        
            case 'medicos':
                data = await Medico.findAll({
                    attributes: ['rut', 'foto', 'nombre', 'apellidos', 'telefono', 'email', 'direccion', 'nacionalidad', 'especialidad_medica'],
                    where: {
                        [Op.and]: [
                            { nombre: { [Op.like]: `%${busqueda}%` } },
                            { estado: 'activo' }  // Filtrar solo médicos activos
                        ]
                    }
                });
                break;
                case 'horario_medico':
                    data = await HorarioMedic.findAll({
                        attributes: ['idHorario', 'diaSemana', 'horaInicio', 'horaFinalizacion', 'inicio_colacion', 'fin_colacion', 'disponibilidad', 'fechaCreacion'],
                        where: {
                            diaSemana: { [Op.like]: `%${busqueda}%` }
                        },
                        include: [{
                            model: Medico,
                            as: 'medico',
                            attributes: ['nombre','apellidos','especialidad_medica'],
                            where: { estado: 'activo' }  // Filtrar solo médicos activos
                        }]
                    });
                    break;
                    case 'cita_medica':
                        data = await CitaMedica.findAll({
                            attributes: ['idCita', 'motivo', 'fecha', 'hora_inicio', 'hora_fin', 'estado'],
                            include: [
                                {
                                    model: Usuario,
                                    as: 'paciente',
                                    attributes: ['nombre', 'apellidos'],  // Solo incluir el nombre del paciente
                                    required: true
                                },
                                {
                                    model: Medico,
                                    as: 'medico',
                                    attributes: ['nombre', 'apellidos'],  // Solo incluir el nombre del médico
                                    required: true
                                },
                                {
                                    model: TipoCita,
                                    as: 'tipoCita', 
                                    attributes: ['especialidad_medica'],
                                }
                            ],
                            where: {
                                [Op.and]: [
                                    {
                                        [Op.or]: [
                                            { '$paciente.nombre$': { [Op.like]: `%${busqueda}%` } },
                                            { '$medico.nombre$': { [Op.like]: `%${busqueda}%` } }
                                        ]
                                    },
                                    { estado_actividad: 'activo' } // Añadir esta línea para filtrar solo citas activas
                                ]
                            }
                        });
                        break;
                    
              
                        case 'tipo_cita':
                            data = await TipoCita.findAll({
                                attributes: ['idTipo', 'especialidad_medica',  'precio',  'duracion_cita'],
                                where: {
                                    especialidad_medica: {
                                        [Op.like]: `%${busqueda}%`
                                    },
                                    estado: 'activo' // Agregar esta línea para filtrar por estado activo
                                }
                            });
                            break;
                        ;
                        case 'facturas':
                            data = await Factura.findAll({
                                where: {
                                    estado: 'activo' 
                                },
                                include: [{
                                    model: CitaMedica,
                                    as: 'citaMedica',
                                    where: {
                                        estado_actividad: 'activo' 
                                    },
                                    include: [
                                        {
                                            model: Usuario,
                                            as: 'paciente',
                                            attributes: ['rut', 'nombre', 'apellidos'],
                                            where: {
                                                nombre: {
                                                    [Op.like]: `%${busqueda}%`
                                                },
                                                estado: 'activo' 
                                            },
                                            required: true
                                        },
                                        {
                                            model: Medico,
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
                
                data = await CitaMedica.findAll({
                    attributes: ['idCita', 'motivo', 'fecha', 'hora_inicio', 'hora_fin', 'estado'],
                    include: [
                        {
                            model: Usuario,
                            as: 'paciente',
                            attributes: ['nombre'],  
                            required: true,
                            where: {
                                estado: 'activo' 
                            }
                        },
                        {
                            model: Medico,
                            as: 'medico',
                            attributes: ['nombre'], 
                            required: true,
                            where: {
                                estado: 'activo' 
                            }
                        },
                        {
                            model: TipoCita,
                            as: 'tipoCita', 
                            attributes: ['especialidad_medica'],
                        }
                    ],
                    where: {
                        [Op.or]: [
                            { '$paciente.nombre$': { [Op.like]: `%${busqueda}%` } },
                            { '$medico.nombre$': { [Op.like]: `%${busqueda}%` } }
                        ],
                        estado_actividad: 'activo' // Añadir esta línea para filtrar solo citas activas
                    }
                });
                break;
                case 'historiales':
                        data = await HistorialMedico.findAll({
                            include: [{
                                model: Usuario, 
                                as: 'paciente', 
                                where: {
                                    nombre: {
                                        [Op.like]: `%${busqueda}%`
                                    },
                                    estado: 'activo' 
                                },
                                attributes: ['nombre', 'apellidos', 'rut'] 
                            }],
                            attributes: ['id_historial', 'diagnostico', 'medicamento', 'notas', 'fecha_consulta', 'archivo', 'rut_medico', 'estado'], // Atributos del historial que quieres incluir
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
  }






export const getTodo = async (req: Request, res: Response) => {
    console.log("ola");
    try {
      const busqueda = req.params.busqueda;
      const regex = new RegExp(busqueda, 'i');
  
      const [usuarios, medicos] = await Promise.all([
        Usuario.findAll({ where: { nombre: { [Op.like]: `%${busqueda}%` } } }),
        Medico.findAll({ where: { nombre: { [Op.like]: `%${busqueda}%` } } }),
      ]);
  
      res.json({
        ok: true,
        resultados: { usuarios, medicos },
      });
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      res.status(500).json({ ok: false, mensaje: 'Error en la búsqueda' });
    }
  };