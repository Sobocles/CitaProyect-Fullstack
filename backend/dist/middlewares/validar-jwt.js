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
            try {
                const { authorization } = req.headers;
                console.log('SE VALIDO EL TOKEN DE CREAR USUARIO', authorization);
                // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2M2NhYjQwNDJhMDA0OGIxMmQwNjE3ZjgiLCJub21icmUiOiJvY3VsdXMgMiIsImFwZWxsaWRvIjoiZWxlY3RybyBzb2Z0IiwiaWF0IjoxNjc0NDExNzM5LCJleHAiOjE2NzQ0OTgxMzl9.lVHpjrRSRmtti67qJu3DeKhAO5-rLChPXFr0zVQscHg
                if (!authorization) {
                    return res.status(401).json({
                        msg: `error token no existe`
                    });
                }
                "Bearer token";
                const token = authorization.split(" ")[1];
                const { rut, nombre, apellidos, rol } = yield jwt_1.default.instance.comprobarToken(token);
                req.rut = rut;
                req.nombre = nombre;
                req.apellidos = apellidos;
                req.rol = rol;
                console.log(rut, nombre, apellidos, rol);
            }
            catch (error) {
                return res.status(500).json({
                    ok: true,
                    msg: `Error conectarse con el servidor`
                });
            }
            next();
        });
    }
}
exports.default = ValidarJwt;
//# sourceMappingURL=validar-jwt.js.map