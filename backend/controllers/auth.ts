import Usuario from '../models/usuario'; 
import bcrypt from 'bcrypt';
import { getMenuFrontEnd } from '../helpers/menu-frontend';
import { Request, Response } from "express";
import * as generatePassword from 'generate-password';
import * as nodemailer from 'nodemailer';
import JwtGenerate from '../helpers/jwt';
import Email from '../helpers/emails';
import Medico from '../models/medico';
import InfoClinica from '../models/info-clinica';



interface CustomRequest extends Request {
    rut?: string;
    rol?: string;
}


export default class Usuarios {
  private static _instance: Usuarios;

  public static get instance() {
      return this._instance || (this._instance = new Usuarios());
  }

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    let userOrMedico: Usuario | Medico | null;

    try {
       
        userOrMedico = await Usuario.findOne({ where: { email } });

        // Verificar si el usuario está inactivo
        if (userOrMedico && userOrMedico.estado === 'inactivo') {
            return res.status(403).json({
                ok: false,
                msg: 'Usuario inactivo, contacte al administrador',
            });
        }

        // Si no se encuentra un Usuario, busca un Medico
        if (!userOrMedico) {
            userOrMedico = await Medico.findOne({ where: { email } });

            // Si se encuentra un Médico, verifica si está activo
            if (userOrMedico && userOrMedico.estado === 'inactivo') {
                return res.status(403).json({
                    ok: false,
                    msg: 'Médico inactivo, contacte al administrador',
                });
            }
        }

        // Si tampoco se encuentra un Medico, retorna un error
        if (!userOrMedico) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado',
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, userOrMedico.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida',
            });
        }

        // Generar el TOKEN - JWT
        let token;
        if (userOrMedico instanceof Usuario) {
            token = await JwtGenerate.instance.generarJWT(userOrMedico.rut, userOrMedico.nombre, userOrMedico.apellidos, userOrMedico.rol); 
        } else if (userOrMedico instanceof Medico) {
            token = await JwtGenerate.instance.generarJWT(userOrMedico.rut, userOrMedico.nombre, userOrMedico.apellidos, userOrMedico.rol);
        }

        res.json({
            ok: true,
            userOrMedico,
            token,
            menu: getMenuFrontEnd(userOrMedico.rol),
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
  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    let userOrMedico: Usuario | Medico | null;

    try {
        // Intenta encontrar un Usuario con el email
        userOrMedico = await Usuario.findOne({ where: { email } });

        // Si no se encuentra un Usuario, busca un Medico
        if (!userOrMedico) {
            userOrMedico = await Medico.findOne({ where: { email } });

            // Si se encuentra un Médico, verifica si está activo
            if (userOrMedico && userOrMedico.estado === 'inactivo') {
                return res.status(403).json({
                    ok: false,
                    msg: 'Médico inactivo, contacte al administrador',
                });
            }
        }

        // Si tampoco se encuentra un Medico, retorna un error
        if (!userOrMedico) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado',
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, userOrMedico.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida',
            });
        }

        // Generar el TOKEN - JWT
        let token;
        if (userOrMedico instanceof Usuario) {
            token = await JwtGenerate.instance.generarJWT(userOrMedico.rut, userOrMedico.nombre, userOrMedico.apellidos, userOrMedico.rol); 
        } else if (userOrMedico instanceof Medico) {
            token = await JwtGenerate.instance.generarJWT(userOrMedico.rut, userOrMedico.nombre, userOrMedico.apellidos, userOrMedico.rol);
        }

        res.json({
            ok: true,
            userOrMedico,
            token,
            menu: getMenuFrontEnd(userOrMedico.rol),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};

¨/

/*

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;



    let userOrMedico: Usuario | Medico | null;

    try {
        // Intenta encontrar un Usuario con el email
        userOrMedico = await Usuario.findOne({ where: { email } });
  

        // Si no se encuentra un Usuario, busca un Medico
        if (!userOrMedico) {
            userOrMedico = await Medico.findOne({ where: { email } });
            console.log('medico ',userOrMedico);
        }

        // Si tampoco se encuentra un Medico, retorna un error
        if (!userOrMedico) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado',
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, userOrMedico.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida',
            });
        }
        console.log(userOrMedico.rol);
        // Generar el TOKEN - JWT
        let token;
        if (userOrMedico instanceof Usuario) {
          token = await JwtGenerate.instance.generarJWT(userOrMedico.rut, userOrMedico.nombre, userOrMedico.apellidos, userOrMedico.rol); 
      } else if (userOrMedico instanceof Medico) {
          token = await JwtGenerate.instance.generarJWT(userOrMedico.rut, userOrMedico.nombre, userOrMedico.apellidos, userOrMedico.rol);
      }
      

        res.json({
            ok: true,
            userOrMedico,
            token,
            menu: getMenuFrontEnd(userOrMedico.rol),
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


public async recuperarPassword(req: Request, res: Response) {
    const { nombre, email } = req.body;

    try {
        let dbUserOrMedico: any = await Usuario.findOne({ where: { nombre } });

        if (!dbUserOrMedico) {
            dbUserOrMedico = await Medico.findOne({ where: { nombre } });

            if (!dbUserOrMedico) {
                return res.status(400).json({
                    ok: false,
                    msg: `El usuario o médico no existe`
                });
            }
        }

        // Verificar si el usuario/medico está inactivo
        if (dbUserOrMedico.estado === 'inactivo') {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario o médico está inactivo y no puede recuperar la contraseña'
            });
        }

        if (email !== dbUserOrMedico.email) {
            return res.status(400).json({
                ok: false,
                msg: `El email es incorrecto`
            });
        }

        // Crear contraseña nueva
        const password = generatePassword.generate({ length: 10, numbers: true });

        const salt = bcrypt.genSaltSync();
        dbUserOrMedico.password = bcrypt.hashSync(password, salt);

        await dbUserOrMedico.save();

        // Enviar correo
        Email.instance.enviarEmail(email, nombre, password);

        return res.status(200).json({
            ok: true,
            msg: `Correo enviado a: ${email} satisfactoriamente`
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: `Error en el funcionamiento del servidor`
        });
    }
}

/*
public async recuperarPassword(req: Request, res: Response) {
    const { nombre, email } = req.body;
    

    try {
        const dbUser = await Usuario.findOne({ where: { nombre } });
        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: `El usuario no existe`
            });
        }

        // Verificar si el usuario está inactivo
        if (dbUser.estado === 'inactivo') {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario está inactivo y no puede recuperar la contraseña'
            });
        }

        if (email !== dbUser.email) {
            return res.status(400).json({
                ok: false,
                msg: `El email es incorrecto`
            });
        }

        // Crear contraseña nueva
        const password = generatePassword.generate({ length: 10, numbers: true });

        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);

        await dbUser.save();

        // Enviar correo
        Email.instance.enviarEmail(email, nombre, password);

        return res.status(200).json({
            ok: true,
            msg: `Correo enviado a: ${email} satisfactoriamente`
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: `Error en el funcionamiento del servidor`
        });
    }
}
*/

// Función para enviar email usando nodemailer
public async enviarEmail(emailRecipient:string, username:string, newPassword:string) {
  let transporter = nodemailer.createTransport({
      service: 'gmail', // Usando Gmail como el servicio
      auth: {
          user: 'smoralespincheira@gmail.com', 
          pass: 'puppetmaster.9' 
      }
  });

  let mailOptions = {
      from: 'smoralespincheira@gmail.com',
      to: emailRecipient,
      subject: 'Recuperación de Contraseña',
      text: `Hola ${username}, tu nueva contraseña es: ${newPassword}`
  };

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      } else {
          console.log('Email enviado: ' + info.response);
      }
  });
}





public async revalidarToken(req: Request | any, res: Response) {
    try {
        const rut: string | undefined = req.rut;
        const rol: string | undefined = req.rol;

        console.log(rut, rol);

        if (!rol) {
            return res.status(400).json({ ok: false, msg: 'Rol no definido' });
        }

        let userOrMedico;
        if (rol === 'USER_ROLE' || rol === 'ADMIN_ROLE') {
            userOrMedico = await Usuario.findOne({ where: { rut } });
        } else if (rol === 'MEDICO_ROLE') {
            userOrMedico = await Medico.findOne({ where: { rut } });
        }

        if (!userOrMedico) {
            return res.status(404).json({ ok: false, msg: 'Usuario o médico no encontrado' });
        }

        // Obténer la información de la clínica
        const infoClinica = await InfoClinica.findOne();

        // Genera un nuevo token y devuelve la información del usuario o médico junto con la info de la clínica
        const newToken = await JwtGenerate.instance.generarJWT(userOrMedico.rut, userOrMedico.nombre, userOrMedico.apellidos, rol);

        const menu = getMenuFrontEnd(rol);

        return res.json({ token: newToken, userOrMedico, menu, infoClinica: infoClinica });

    } catch (error) {
        return res.status(500).json({ ok: false, msg: 'Error del servidor' });
    }
}








}