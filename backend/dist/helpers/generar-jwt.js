"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const enviorenment_1 = require("../global/enviorenment");
class JwtGenerate {
    static get instance() {
        return this._instance || (this._instance = new JwtGenerate());
    }
    generarJWT(uid, nombre, apellido) {
        const payload = { uid, nombre, apellido };
        return new Promise((resolve, reject) => {
            (0, jsonwebtoken_1.sign)(payload, enviorenment_1.SECRET_JWT, {
                expiresIn: '24h'
            }, (error, token) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                else {
                    resolve(token);
                }
            });
        });
    }
}
exports.default = JwtGenerate;
//# sourceMappingURL=generar-jwt.js.map