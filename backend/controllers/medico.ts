// controllers/medico.ts
import { Request, Response } from 'express';
import Medico from '../models/medico';
import HorarioMedic from '../models/horario_medico';
import bcrypt from 'bcrypt';
import JwtGenerate from '../helpers/jwt';
import TipoCita from '../models/tipo_cita';
import Factura from '../models/factura';
import CitaMedica from '../models/cita_medica';
import { Op } from 'sequelize';
import Rol from '../models/rol';
import { UserRole } from '../types/enums';

export default class Medicos {
    private static _instance: Medicos;

    public static get instance() {
        return this._instance || (this._instance = new Medicos());
    }

    getMedicos = async (req: Request, res: Response) => {
      console.log('Obteniendo médicos...');
      try {
          const desde = Number(req.query.desde) || 0;
  
          // Obtén el total de médicos activos
          const totalMedicos = await Medico.count({
              where: {
                  estado: 'activo' // Contar solo médicos activos
              }
          });
  
          // Obtén los detalles de todos los médicos activos
          const medicos = await Medico.findAll({
              where: {
                  estado: 'activo' // Filtrar por médicos activos
              },
              include: [{
                model: Rol,
                as: 'rol',
                attributes: ['id', 'nombre', 'codigo']
              }],
              offset: desde,
              limit: 5,
          });
  
          res.json({
              ok: true,
              medicos,
              total: totalMedicos
          });
      } catch (error) {
          console.error('Error al obtener los médicos:', error);
          res.status(500).json({
              msg: 'Error en el servidor',
          });
      }
    };
  
    getMedicosEspecialidad = async (req: Request, res: Response) => {
      try {
          // Obtener todas las especialidades válidas de TipoCita
          const especialidadesValidas = await TipoCita.findAll({
              attributes: ['especialidad_medica']
          });
          const especialidades = especialidadesValidas.map(ec => ec.especialidad_medica);
  
          // Obtener todos los médicos activos
          const medicos = await Medico.findAll({
              attributes: ['rut', 'nombre', 'apellidos', 'especialidad_medica'],
              include: [{
                model: Rol,
                as: 'rol',
                attributes: ['codigo']
              }],
              where: {
                  estado: 'activo' // Agregar condición para filtrar solo médicos activos
              }
          });
  
          // Procesamos los médicos para asegurar compatibilidad
          const medicosProcesados = medicos.map(medico => {
              const medicoJSON = medico.toJSON();
              // Asignar el código del rol directamente para compatibilidad
              if (medicoJSON.rol && medicoJSON.rol.codigo) {
                  medicoJSON.rol = medicoJSON.rol.codigo;
              }
              return medicoJSON;
          });
  
          // Filtrar los médicos que tienen una especialidad válida
          const medicosFiltrados = medicosProcesados.filter(medico => 
              especialidades.includes(medico.especialidad_medica)
          );
  
          res.json({
              ok: true,
              medicos: medicosFiltrados
          });
      } catch (error) {
          console.error('Error al obtener los médicos y sus especialidades:', error);
          res.status(500).json({
              ok: false,
              msg: 'Error en el servidor'
          });
      }
    };
  
    getAllMedicos = async (req: Request, res: Response) => {
      console.log('Obteniendo todos los médicos');
      try {
          // Obtén el total de médicos activos
          const totalMedicosActivos = await Medico.count({
              where: { estado: 'activo' } // Filtra por estado activo
          });

          // Obtén los detalles de todos los médicos activos
          const medicosActivos = await Medico.findAll({
              where: { estado: 'activo' }, // Filtra por estado activo
              include: [{
                model: Rol,
                as: 'rol',
                attributes: ['id', 'nombre', 'codigo']
              }]
          });

          // Procesamos los médicos para asegurar compatibilidad
          const medicosProcesados = medicosActivos.map(medico => {
              const medicoJSON = medico.toJSON();
              // Asignar el código del rol directamente para compatibilidad
              if (medicoJSON.rol && medicoJSON.rol.codigo) {
                  medicoJSON.rol = medicoJSON.rol.codigo;
              }
              return medicoJSON;
          });

          res.json({
              ok: true,
              medicos: medicosProcesados,
              total: totalMedicosActivos
          });
      } catch (error) {
          console.error(error);
          res.status(500).json({
              msg: 'Error en el servidor',
          });
      }
    };

    getMedico = async(req: Request, res: Response) => {
        const { rut } = req.params;
    
        try {
            const medico = await Medico.findByPk(rut, {
                include: [{
                    model: Rol,
                    as: 'rol',
                    attributes: ['id', 'nombre', 'codigo']
                }]
            });

            if (!medico) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Médico no encontrado',
                });
            }

            // Procesar el médico para asegurar compatibilidad
            const medicoJSON = medico.toJSON();
            // Asignar el código del rol directamente para compatibilidad
            if (medicoJSON.rol && medicoJSON.rol.codigo) {
                medicoJSON.rol = medicoJSON.rol.codigo;
            }

            res.json({
                ok: true,
                medico: medicoJSON,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador',
            });
        }
    };

    CrearMedico = async(req: Request, res: Response) => {
        const { email, password, rut, telefono, rol: rolCodigo, ...medicoData } = req.body;
    
        try {
            // Verificar si el correo ya está registrado por un médico activo
            const existeEmailMedico = await Medico.findOne({ 
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
            const existeRutMedico = await Medico.findOne({ 
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
            const existeTelefonoMedico = await Medico.findOne({ 
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
    
            // Obtener el ID del rol (por defecto MEDICO_ROLE)
            let rolId = 3; // Asumiendo que el ID de MEDICO_ROLE es 3
            
            // Si se proporciona un rol específico, buscar su ID
            if (rolCodigo) {
                const rol = await Rol.findOne({ where: { codigo: rolCodigo } });
                if (rol) {
                    rolId = rol.id;
                }
            } else {
                // Si no se proporciona, buscar el rol de médico
                const rolMedico = await Rol.findOne({ where: { codigo: UserRole.MEDICO } });
                if (rolMedico) {
                    rolId = rolMedico.id;
                }
            }
    
            // Encriptar contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
    
            // Crea un nuevo médico
            const nuevoMedico = await Medico.create({
                ...medicoData,
                email,
                rut,
                telefono,
                password: hashedPassword,
                rolId: rolId // Usar el ID del rol
            });
    
            // Obtener el rol para el JWT
            const rol = await Rol.findByPk(rolId);
            const rolCodigoJWT = rol ? rol.codigo : UserRole.MEDICO;
    
            // Genera el JWT usando el código del rol
            const token = await JwtGenerate.instance.generarJWT(
                nuevoMedico.rut, 
                nuevoMedico.nombre, 
                nuevoMedico.apellidos, 
                rolCodigoJWT
            );
    
            // Procesar el médico para la respuesta
            const medicoJSON = nuevoMedico.toJSON();
            medicoJSON.rol = rolCodigoJWT; // Asignar el código del rol
    
            res.json({
                ok: true,
                medico: medicoJSON,
                token
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador',
            });
        }
    };

    putMedico = async (req: Request, res: Response) => {
        try {
            const { rut } = req.params;
            const { body } = req;
            console.log('aqui esta el rut', rut);
            
            // Si se incluye un rol, obtener su ID
            if (body.rol) {
                const rol = await Rol.findOne({ where: { codigo: body.rol } });
                if (rol) {
                    body.rolId = rol.id;
                }
                // Eliminar el campo rol para evitar conflictos
                delete body.rol;
            }
            
            // Buscar el médico por su ID
            const medico = await Medico.findByPk(rut);
    
            if (!medico) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Médico no encontrado',
                });
            }
    
            // Actualizar los campos del médico con los valores proporcionados
            await medico.update(body);
            
            // Para la respuesta, obtener el médico con su rol
            const medicoActualizado = await Medico.findByPk(rut, {
                include: [{
                    model: Rol,
                    as: 'rol',
                    attributes: ['id', 'nombre', 'codigo']
                }]
            });
            
            // Procesar el médico para asegurar compatibilidad
            const medicoJSON = medicoActualizado?.toJSON() || {};
            // Asignar el código del rol directamente para compatibilidad
            if (medicoJSON.rol && medicoJSON.rol.codigo) {
                medicoJSON.rol = medicoJSON.rol.codigo;
            }
    
            res.json({
                ok: true,
                medico: medicoJSON,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador',
            });
        }
    };
    
    deleteMedico = async (req: Request, res: Response) => {
        const { rut } = req.params;
    
        try {
            const medico = await Medico.findByPk(rut);
    
            if (!medico) {
                return res.status(404).json({
                    msg: 'No existe un médico con el rut ' + rut,
                });
            }
    
            // Encuentra todas las citas médicas asociadas al médico en ciertos estados
            const citas = await CitaMedica.findAll({
                where: {
                    rut_medico: medico.rut,
                    estado: {
                        [Op.in]: ['terminado', 'no_pagado', 'no_asistio']
                    }
                }
            });
    
            // Cambia el estado de actividad de las citas médicas seleccionadas a "inactivo"
            for (const cita of citas) {
                await cita.update({ estado_actividad: 'inactivo' });
            }
    
            // Encuentra y elimina todos los horarios asociados al médico
            await HorarioMedic.destroy({ where: { rut_medico: medico.rut } });
    
            // Cambiar el estado del médico a inactivo
            await medico.update({ estado: 'inactivo' });
    
            res.json({ 
                ok: true,
                msg: 'Médico, sus citas médicas seleccionadas y horarios asociados actualizados a estado inactivo.' 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                ok: false,
                msg: 'Error en el servidor' 
            });
        }
    };

    cambiarPasswordMedico = async (req: Request, res: Response) => {
        console.log(req.body);
        const { rut, password, newPassword } = req.body;

        try {
            // Buscar el médico por su RUT
            const dbMedico = await Medico.findByPk(rut);
            if (!dbMedico) {
                return res.status(400).json({
                    ok: false,
                    msg: `No existe el médico con RUT: ${rut}`
                });
            }

            // Verificar que la contraseña actual sea correcta
            const validPassword = bcrypt.compareSync(password, dbMedico.password);
            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: `La contraseña actual es incorrecta`
                });
            }

            // Verificar que la nueva contraseña no sea igual a la actual
            const validNewPassword = bcrypt.compareSync(newPassword, dbMedico.password);
            if (validNewPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: `La nueva contraseña no puede ser igual a la contraseña actual`
                });
            }

            // Actualizar la contraseña
            const salt = bcrypt.genSaltSync();
            dbMedico.password = bcrypt.hashSync(newPassword, salt);
            await dbMedico.save();

            return res.status(200).json({
                ok: true,
                msg: `La contraseña del médico ${dbMedico.nombre} ha sido actualizada correctamente`
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                ok: false,
                msg: `Error al conectar con el servidor`
            });
        }
    };
};