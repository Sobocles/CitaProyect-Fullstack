// controllers/usuario.ts
import { Request, Response } from 'express';
import Usuario from '../models/usuario';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import bycript from "bcrypt";
import JwtGenerate from '../helpers/jwt';
import HistorialMedico from '../models/historial_medico';
import CitaMedica from '../models/cita_medica';
import Factura from '../models/factura';
import AuthService from '../services/auth.service';
import Rol from '../models/rol';

const authService = AuthService.instance;

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const desde = Number(req.query.desde) || 0;

    // Obtén el total de usuarios activos
    const totalUsuarios = await Usuario.count({
      where: { estado: 'activo' } // Incluye solo usuarios activos
    });

    // Obtén los detalles de todos los usuarios activos con paginación y sin mostrar campos sensibles
    const usuarios = await Usuario.findAll({
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      },
      where: { estado: 'activo' }, // Incluye solo usuarios activos
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
      usuarios,
      total: totalUsuarios
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
};

export const CrearUsuario = async(req: Request, res: Response) => {
  console.log('========= INICIO CREAR USUARIO =========');
  console.log('Datos recibidos:', req.body);
  const { email, password, nombre, apellidos, telefono, rol: rolCodigo } = req.body;

  try {
    // Verificar si el correo ya está registrado
    console.log('Verificando email existente:', email);
    if (await authService.verificarEmailExistente(email)) {
      console.log('Email ya registrado');
      return res.status(400).json({
        ok: false,
        msg: 'El correo ya está registrado',
      });
    }

    // Verificar si el teléfono ya está registrado
    console.log('Verificando teléfono existente:', telefono);
    if (await authService.verificarTelefonoExistente(telefono)) {
      console.log('Teléfono ya registrado');
      return res.status(400).json({
        ok: false,
        msg: 'El teléfono ya está registrado',
      });
    }

    // Obtener el ID del rol basado en el código proporcionado o usar el predeterminado (USER_ROLE)
    let rolId = 2; // ID predeterminado para el rol de usuario (USER_ROLE)
    
    if (rolCodigo) {
      const rol = await Rol.findOne({ where: { codigo: rolCodigo } });
      if (rol) {
        rolId = rol.id;
      } else {
        console.log(`Rol con código ${rolCodigo} no encontrado, usando rol predeterminado`);
      }
    }

    // Preparar los datos del usuario con rolId en lugar de rol
    const userData = {
      ...req.body,
      rolId: rolId
    };
    
    // Eliminar el campo rol si existe para evitar conflictos
    delete userData.rol;

    // Usar el servicio para registrar al usuario
    console.log('Registrando usuario mediante authService con rolId:', rolId);
    const resultado = await authService.registrarUsuario(userData);
    console.log(resultado);
    console.log('Usuario registrado exitosamente:', resultado.userOrMedico.rut);

    // Devolver respuesta en el formato esperado por el frontend
    console.log('Enviando respuesta exitosa');
    res.json({
      ok: true,
      usuario: resultado.userOrMedico,
      token: resultado.token,
    });
  } catch (error) {
    console.error('ERROR EN CREAR USUARIO:', error);
    if (error instanceof Error) {
      console.error('Mensaje del error:', error.message);
      console.error('Stack trace:', error.stack);
    }
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs',
    });
  } finally {
    console.log('========= FIN CREAR USUARIO =========');
  }
};

// Método para obtener a todos los pacientes
export const getAllUsuarios = async (req: Request, res: Response) => {
  try {
    // Obtener los detalles de todos los pacientes que no son administradores y que están activos
    const usuarios = await Usuario.findAll({
      include: [{
        model: Rol,
        as: 'rol',
        where: {
          codigo: {
            [Op.ne]: 'ADMIN_ROLE' // Excluye a los usuarios con rol 'ADMIN_ROLE'
          }
        }
      }, {
        model: CitaMedica,
        attributes: ['idCita', 'estado', 'fecha', 'hora_inicio', 'hora_fin'],
        where: {
          estado: {
            [Op.or]: ['en_curso', 'no_asistido', 'pagado']
          }
        },
        required: false // Incluye usuarios incluso si no tienen citas en esos estados
      }],
      where: {
        estado: 'activo' // Incluye solo usuarios activos
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'] // Excluye estos atributos
      }
    });

    // Obtén el total de pacientes activos que no son administradores
    const totalPacientes = usuarios.length;

    res.json({
      ok: true,
      usuarios,
      total: totalPacientes
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
};

export const getPacientesConCitasPagadasYEnCurso = async (req: Request, res: Response) => {
  const { rut_medico } = req.params;
  
  try {
    // Obténer los detalles de los pacientes con citas en estado 'en_curso' y 'pagado' con un médico específico
    const pacientesConCitasPagadas = await CitaMedica.findAll({
      where: {
        rut_medico, // Filtra por el médico específico
        estado: ['en_curso', 'pagado', 'terminado'], // Estados de la cita
        estado_actividad: 'activo' // Solo citas activas
      },
      include: [{
        model: Usuario,
        as: 'paciente',
        include: [{
          model: Rol,
          as: 'rol',
          where: {
            codigo: { 
              [Op.ne]: 'ADMIN_ROLE' // Excluye a los usuarios con rol 'ADMIN_ROLE'
            }
          }
        }],
        where: {
          estado: 'activo' // Solo usuarios activos
        },
        attributes: { 
          exclude: ['password', 'createdAt', 'updatedAt'] 
        }
      }]
    });

    // Mapea los resultados para obtener solo los datos de los pacientes
    const usuarios = pacientesConCitasPagadas.map(cita => cita.paciente);

    res.json({
      ok: true,
      usuarios,
      total: usuarios.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
};

export const getPacientesConCitasPagadasYEnCursoYterminado = async (req: Request, res: Response) => {
  const { rut_medico } = req.params;
  
  try {
    // Obténer los detalles de los pacientes con citas en estado 'en_curso' y 'pagado' con un médico específico
    const pacientesConCitasPagadas = await CitaMedica.findAll({
      where: {
        rut_medico, // Filtra por el médico específico
        estado: ['en_curso', 'pagado','terminado'], // Estados de la cita
        estado_actividad: 'activo' // Solo citas activas
      },
      include: [{
        model: Usuario,
        as: 'paciente',
        include: [{
          model: Rol,
          as: 'rol',
          where: {
            codigo: { 
              [Op.ne]: 'ADMIN_ROLE' // Excluye a los usuarios con rol 'ADMIN_ROLE'
            }
          }
        }],
        where: {
          estado: 'activo' // Solo usuarios activos
        },
        attributes: { 
          exclude: ['password', 'createdAt', 'updatedAt'] 
        }
      }]
    });

    // Mapea los resultados para obtener solo los datos de los pacientes
    const usuarios = pacientesConCitasPagadas.map(cita => cita.paciente);

    res.json({
      ok: true,
      usuarios,
      total: usuarios.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
};

export const getUsuario = async( req: Request , res: Response ) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id, {
      include: [{
        model: Rol,
        as: 'rol',
        attributes: ['id', 'nombre', 'codigo']
      }]
    });

    if(usuario) {
      return res.json(usuario);
    }

    return res.status(404).json({
      msg: `No existe un usuario con el id ${ id }`
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
};

export const putUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let { body } = req;

    // Si se incluye un código de rol, buscar su ID correspondiente
    if (body.rol) {
      const rol = await Rol.findOne({ where: { codigo: body.rol } });
      if (rol) {
        body.rolId = rol.id;
      }
      // Eliminar el campo rol para evitar conflictos
      delete body.rol;
    }
  
    // Buscar el usuario por su ID
    const usuario = await Usuario.findByPk(id);
  
    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario no encontrado',
      });
    }
  
    // Si la contraseña no está presente o está vacía en la solicitud, elimínala del objeto body
    if (!body.password || body.password.trim() === '') {
      delete body.password;
    }
  
    // Actualizar los campos del usuario con los valores proporcionados en el cuerpo de la solicitud
    await usuario.update(body);
  
    res.json({
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};
  
export const deleteUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ msg: 'No existe un usuario con el id ' + id });
    }

    // Cambiar el estado de las citas médicas a 'inactivo'
    await CitaMedica.update({ estado_actividad: 'inactivo' }, { where: { rut_paciente: usuario.rut } });

    // Cambiar el estado de los historiales médicos a 'inactivo'
    await HistorialMedico.update({ estado_actividad: 'inactivo' }, { where: { rut_paciente: usuario.rut } });

    // Cambiar el estado del usuario a 'inactivo'
    await usuario.update({ estado: 'inactivo' });

    res.json({ msg: `Usuario ${usuario.nombre} y todas sus entidades relacionadas han sido actualizadas a inactivo correctamente.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

export const cambiarPassword = async (req: Request, res: Response) => {
  console.log(req.body);
  const { rut, password, newPassword } = req.body;
  
  try {
    // agregar el password nuevo != password anterior
    const dbUsuario = await Usuario.findByPk(rut);
    if (!dbUsuario) {
      return res.status(400).json({
        msg: `No existe el usuario con id: ${rut}`
      });
    }
    const validPassword = bycript.compareSync(password, dbUsuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: `El password es incorrecto`
      });
    }

    const validNewPassword = bycript.compareSync(newPassword, dbUsuario.password);

    if (validNewPassword) {
      return res.status(400).json({
        ok: false,
        msg: `El password nuevo es igual al password anterior`
      });
    }

    const salt = bycript.genSaltSync();
    dbUsuario.password = bycript.hashSync(newPassword, salt);

    dbUsuario.save();

    return res.status(200).json({
      ok: true,
      msg: `El usuario ${dbUsuario.nombre} ha cambiado de contraseña`
    });
  } catch (error) {
    return res.status(500).json({
      ok: true,
      msg: `Error conectarse con el servidor`
    });
  }
}