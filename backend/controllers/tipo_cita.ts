import { Request, Response } from 'express';
import tipoCitaService from '../services/tipocita.service';
import { CrearTipoCitaDto, ActualizarTipoCitaDto } from '../dtos/tipo-cita.dto';

export class TipoCitaController {
  // Métodos para especialidades
  async getAllEspecialidades(req: Request, res: Response) {
    try {
      const especialidades = await tipoCitaService.getAllEspecialidades();
      res.json({ especialidades });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEspecialidades(req: Request, res: Response) {
    try {
      const especialidades = await tipoCitaService.getEspecialidadesDisponibles();
      res.json({ especialidades });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Métodos CRUD para tipos de cita
  async getTipoCitas(req: Request, res: Response) {
    try {
      const desde = Number(req.query.desde) || 0;
      const limite = 5;
      const { count, rows: tipo_cita } = await tipoCitaService.getTipoCitas(desde, limite);
      
      res.json({
        ok: true,
        tipo_cita,
        total: count
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTipoCita(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tipoCita = await tipoCitaService.getTipoCita(parseInt(id));
      
      if (!tipoCita) {
        return res.status(404).json({
          ok: false,
          msg: 'Tipo de cita no encontrado'
        });
      }

      res.json({
        ok: true,
        tipoCita
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async crearTipoCita(req: Request, res: Response) {
    try {
      const tipoCitaData: CrearTipoCitaDto = req.body;
      const tipoCita = await tipoCitaService.crearTipoCita(tipoCitaData);
      res.status(201).json({
        ok: true,
        tipoCita
      });
    } catch (error: any) {
      res.status(400).json({
        ok: false,
        msg: error.message
      });
    }
  }

  async putTipoCita(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tipoCitaData: ActualizarTipoCitaDto = req.body;
      const tipoCita = await tipoCitaService.actualizarTipoCita(parseInt(id), tipoCitaData);
      
      res.json({
        ok: true,
        msg: 'Tipo de cita actualizado correctamente',
        tipoCita
      });
    } catch (error: any) {
      const status = error.message === 'Tipo de cita no encontrado' ? 404 : 400;
      res.status(status).json({ error: error.message });
    }
  }

  async deleteTipoCita(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tipoCita = await tipoCitaService.eliminarTipoCita(parseInt(id));
      
      res.json({ 
        ok: true,
        msg: 'Tipo de cita desactivado correctamente',
        tipoCita 
      });
    } catch (error: any) {
      const status = error.message === 'Tipo de cita no encontrado' ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  }
}

export const tipoCitaController = new TipoCitaController();