import { NextFunction, Request, Response } from "express";
import JwtGenerate from "../helpers/jwt";

export default class ValidarJwt {
    private static _intance: ValidarJwt;

    public static get instance() {
        return this._intance || (this._intance = new ValidarJwt());
    }

    constructor() { }

    public async validarJwt(req: Request | any, res: Response, next: NextFunction) {
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
          const decodedToken = await JwtGenerate.instance.comprobarToken(token);
          console.log('🔐 Token decodificado:', decodedToken);
          
          const { rut, nombre, apellidos, rol } = decodedToken;
          console.log('🔐 Datos extraídos del token:', { rut, nombre, apellidos, rol });
          
          req.rut = rut;
          req.nombre = nombre;
          req.apellidos = apellidos;
          req.rol = rol;
          
          console.log('🔐 Datos añadidos al request:', { rut, nombre, apellidos, rol });
          console.log('🔐 Middleware ValidarJwt completado');
        } catch (error) {
          console.error('🔐 Error en ValidarJwt:', error);
          return res.status(500).json({
            ok: false,
            msg: `Error conectarse con el servidor`
          });
        }
        next();
      }
}