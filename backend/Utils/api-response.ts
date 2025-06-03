// BACKEND/utils/api-response.ts
import { Response } from 'express';

export class ApiResponse {
  /**
   * Envía una respuesta exitosa
   */
  public static success(res: Response, data: any, statusCode: number = 200): Response {
    return res.status(statusCode).json({
      ok: true,
      ...data
    });
  }

  /**
   * Envía una respuesta de error
   */
  public static error(res: Response, msg: string, statusCode: number = 400): Response {
    return res.status(statusCode).json({
      ok: false,
      msg
    });
  }

  /**
   * Envía una respuesta de error de servidor
   */
  public static serverError(res: Response, error: any): Response {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error interno del servidor'
    });
  }
}

export default ApiResponse;