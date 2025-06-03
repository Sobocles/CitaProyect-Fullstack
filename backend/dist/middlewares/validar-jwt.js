"use strict";
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
const jwt_1 = __importDefault(require("../helpers/jwt"));
class ValidarJwt {
    static get instance() {
        return this._intance || (this._intance = new ValidarJwt());
    }
    constructor() { }
    validarJwt(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('🔐 Middleware ValidarJwt iniciado');
            try {
                const { authorization } = req.headers;
                console.log('🔐 Header de autorización:', authorization ? 'Presente' : 'Ausente');
                if (!authorization) {
                    console.error('🔐 Error: Token no existe en headers');
                    return res.status(401).json({
                        msg: `error token no existe`
                    });
                }
                const token = authorization.split(" ")[1];
                console.log('🔐 Token extraído de header:', token.substring(0, 15) + '...');
                console.log('🔐 Llamando a comprobarToken');
                const decodedToken = yield jwt_1.default.instance.comprobarToken(token);
                console.log('🔐 Token decodificado:', decodedToken);
                const { rut, nombre, apellidos, rol } = decodedToken;
                console.log('🔐 Datos extraídos del token:', { rut, nombre, apellidos, rol });
                req.rut = rut;
                req.nombre = nombre;
                req.apellidos = apellidos;
                req.rol = rol;
                console.log('🔐 Datos añadidos al request:', { rut, nombre, apellidos, rol });
                console.log('🔐 Middleware ValidarJwt completado');
            }
            catch (error) {
                console.error('🔐 Error en ValidarJwt:', error);
                return res.status(500).json({
                    ok: false,
                    msg: `Error conectarse con el servidor`
                });
            }
            next();
        });
    }
}
exports.default = ValidarJwt;
//# sourceMappingURL=validar-jwt.js.map