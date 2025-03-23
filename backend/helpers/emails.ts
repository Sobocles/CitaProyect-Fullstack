// helpers/email.helper.ts

import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import InfoClinica from '../models/info-clinica';

export default class Email {
    private static _instance: Email;
    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

    public static get instance() {
        return this._instance || (this._instance = new Email());
    }

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", //enviara correos a cuentas tipo gmail
            port: 465, //numero por defecto
            secure: true,
            auth: {
                user: 'smoralespincheira@gmail.com',
                pass: 'jmfw qohp okfp nrfe'
            }
        });
    }

    public verificarEmail() {
        this.transporter.verify().then(() => {
            console.log('Listo para enviar email')
        })
    }
     //email donde se quiere enviar el correo, el nombre del usuario que quiere recuperar el email, y se le envia el password nuevo (se le envia la contraseña nueva para que pueda recuperar su sesion)
    public async enviarEmail(email: string, nombre: string, passwordNew: string) {
        return await this.transporter.sendMail({
            from: '"Recuperacion de contraseña" <smoralespincheira@gmail.com>', //este es el email del administrador que le envia la contraseña al usuario de forma automatica
            to: email,
            subject: 'Recuperacion de contraseña',
            html: `<b>Su nombre es: ${nombre} y su nueva contraseña es: ${passwordNew}. Por favor cambie su contraseña una vez que ingrese.</b>` //se le envia la contraseña nueva
        });
    }

    public async enviarConfirmacionCita(detallesCita: any) {
        const { fecha, hora_inicio, medicoNombre, especialidad, pacienteNombre, emailPaciente } = detallesCita;
 
    
        return await this.transporter.sendMail({
            from: '"Confirmación de Cita Médica" <smoralespincheira@gmail.com>',
            to: emailPaciente,
            subject: 'Confirmación de su cita médica',
            html: `
                <h1>Confirmación de Cita</h1>
                <p>Estimado/a ${pacienteNombre},</p>
                <p>Le confirmamos que su cita con ${medicoNombre}, especialista en ${especialidad}, está programada para el ${fecha} a las ${hora_inicio}.</p>
                <p>Por favor, asegúrese de llegar 10 minutos antes de su hora programada.</p>
                <p>Si tiene alguna pregunta, no dude en contactarnos.</p>
                <br>
                <p>Saludos cordiales,</p>
                <p>El equipo de su centro médico</p>
            `
        });
    }
}
