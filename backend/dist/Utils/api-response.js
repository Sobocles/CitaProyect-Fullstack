"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    /**
     * Envía una respuesta exitosa
     */
    static success(res, data, statusCode = 200) {
        return res.status(statusCode).json(Object.assign({ ok: true }, data));
    }
    /**
     * Envía una respuesta de error
     */
    static error(res, msg, statusCode = 400) {
        return res.status(statusCode).json({
            ok: false,
            msg
        });
    }
    /**
     * Envía una respuesta de error de servidor
     */
    static serverError(res, error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        });
    }
}
exports.ApiResponse = ApiResponse;
exports.default = ApiResponse;
//# sourceMappingURL=api-response.js.map