// BACKEND/helpers/jwt.ts
import { sign, verify } from 'jsonwebtoken';
import { SECRET_JWT } from '../global/enviorenment';
import { Response } from 'express';

export default class JwtGenerate {
    private static _instance: JwtGenerate;
    
    public static get instance() {
        return this._instance || (this._instance = new JwtGenerate());
    }
    
    public generarJWT(rut: string, nombre: string, apellidos: string, rol: string): Promise<string> {
        const payload = {rut, nombre, apellidos, rol};
        
        return new Promise<string>((resolve, reject) => {
            sign(payload, SECRET_JWT, {
                expiresIn: '24h'
            }, (error, token) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    // Sabemos que token será un string si no hay error
                    resolve(token as string);
                }
            });
        });
    }
    
    public async comprobarToken(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            verify(token, SECRET_JWT, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}