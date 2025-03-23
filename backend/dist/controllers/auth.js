"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const usuario_1 = __importDefault(require("../models/usuario"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const menu_frontend_1 = require("../helpers/menu-frontend");
const generatePassword = __importStar(require("generate-password"));
const nodemailer = __importStar(require("nodemailer"));
const jwt_1 = __importDefault(require("../helpers/jwt"));
const emails_1 = __importDefault(require("../helpers/emails"));
const medico_1 = __importDefault(require("../models/medico"));
const info_clinica_1 = __importDefault(require("../models/info-clinica"));
class Usuarios {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            let userOrMedico;
            try {
                userOrMedico = yield usuario_1.default.findOne({ where: { email } });
                // Verificar si el usuario está inactivo
                if (userOrMedico && userOrMedico.estado === 'inactivo') {
                    return res.status(403).json({
                        ok: false,
                        msg: 'Usuario inactivo, contacte al administrador',
                    });
                }
                // Si no se encuentra un Usuario, busca un Medico
                if (!userOrMedico) {
                    userOrMedico = yield medico_1.default.findOne({ where: { email } });
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
                const validPassword = bcrypt_1.default.compareSync(password, userOrMedico.password);
                if (!validPassword) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Contraseña no válida',
                    });
                }
                // Generar el TOKEN - JWT
                let token;
                if (userOrMedico instanceof usuario_1.default) {
                    token = yield jwt_1.default.instance.generarJWT(userOrMedico.rut, userOrMedico.nombre, userOrMedico.apellidos, userOrMedico.rol);
                }
                else if (userOrMedico instanceof medico_1.default) {
                    token = yield jwt_1.default.instance.generarJWT(userOrMedico.rut, userOrMedico.nombre, userOrMedico.apellidos, userOrMedico.rol);
                }
                res.json({
                    ok: true,
                    userOrMedico,
                    token,
                    menu: (0, menu_frontend_1.getMenuFrontEnd)(userOrMedico.rol),
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
    }
    static get instance() {
        return this._instance || (this._instance = new Usuarios());
    }
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
    recuperarPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, email } = req.body;
            try {
                let dbUserOrMedico = yield usuario_1.default.findOne({ where: { nombre } });
                if (!dbUserOrMedico) {
                    dbUserOrMedico = yield medico_1.default.findOne({ where: { nombre } });
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
                const salt = bcrypt_1.default.genSaltSync();
                dbUserOrMedico.password = bcrypt_1.default.hashSync(password, salt);
                yield dbUserOrMedico.save();
                // Enviar correo
                emails_1.default.instance.enviarEmail(email, nombre, password);
                return res.status(200).json({
                    ok: true,
                    msg: `Correo enviado a: ${email} satisfactoriamente`
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    ok: false,
                    msg: `Error en el funcionamiento del servidor`
                });
            }
        });
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
    enviarEmail(emailRecipient, username, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
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
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('Email enviado: ' + info.response);
                }
            });
        });
    }
    revalidarToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rut = req.rut;
                const rol = req.rol;
                console.log(rut, rol);
                if (!rol) {
                    return res.status(400).json({ ok: false, msg: 'Rol no definido' });
                }
                let userOrMedico;
                if (rol === 'USER_ROLE' || rol === 'ADMIN_ROLE') {
                    userOrMedico = yield usuario_1.default.findOne({ where: { rut } });
                }
                else if (rol === 'MEDICO_ROLE') {
                    userOrMedico = yield medico_1.default.findOne({ where: { rut } });
                }
                if (!userOrMedico) {
                    return res.status(404).json({ ok: false, msg: 'Usuario o médico no encontrado' });
                }
                // Obténer la información de la clínica
                const infoClinica = yield info_clinica_1.default.findOne();
                // Genera un nuevo token y devuelve la información del usuario o médico junto con la info de la clínica
                const newToken = yield jwt_1.default.instance.generarJWT(userOrMedico.rut, userOrMedico.nombre, userOrMedico.apellidos, rol);
                const menu = (0, menu_frontend_1.getMenuFrontEnd)(rol);
                return res.json({ token: newToken, userOrMedico, menu, infoClinica: infoClinica });
            }
            catch (error) {
                return res.status(500).json({ ok: false, msg: 'Error del servidor' });
            }
        });
    }
}
exports.default = Usuarios;
//# sourceMappingURL=auth.js.map