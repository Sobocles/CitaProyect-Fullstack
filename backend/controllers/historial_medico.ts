import { Request, Response } from 'express';
import historialMedicoService from '../services/historialmedico.service';

export default class HistorialMedicoController {
    async getHistoriales(req: Request, res: Response) {
        try {
            const { count, rows: historiales } = await historialMedicoService.getHistoriales();
            res.json({ historiales });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getHistorial(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const desde = Number(req.query.desde) || 0;
            const limite = Number(req.query.limite) || 5;

            const { count, historiales } = await historialMedicoService.getHistorialPaciente(
                id, desde, limite
            );
            
            if (count === 0) {
                return res.status(200).json({
                    ok: true,
                    msg: 'No hay historiales activos para el paciente',
                    historiales: []
                });
            }

            res.json({
                ok: true,
                historiales,
                total: count
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getHistorialMedico(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const desde = Number(req.query.desde) || 0;
            const limite = Number(req.query.limite) || 5;

            const { count, historiales } = await historialMedicoService.getHistorialMedico(
                id, desde, limite
            );
            
            if (count === 0) {
                return res.status(200).json({
                    ok: true,
                    msg: 'No hay historiales activos para este médico',
                    historiales: []
                });
            }

            res.json({
                ok: true,
                historiales,
                total: count
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getHistorialPorId(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const historial = await historialMedicoService.getHistorialPorId(parseInt(id));
            
            if (!historial) {
                return res.status(404).json({
                    msg: 'No se encontró el historial médico'
                });
            }

            res.json(historial);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async crearHistorial(req: Request, res: Response) {
        try {
            const historial = await historialMedicoService.crearHistorial(req.body);
            res.status(201).json({
                ok: true,
                historial
            });
        } catch (error: any) {
            res.status(400).json({
                ok: false,
                msg: error.message
            });
        }
    }

    async putHistorial(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const historial = await historialMedicoService.actualizarHistorial(
                parseInt(id), 
                req.body
            );
            
            res.json({
                ok: true,
                msg: 'Historial actualizado correctamente',
                historial
            });
        } catch (error: any) {
            const status = error.message === 'Historial no encontrado' ? 404 : 500;
            res.status(status).json({ error: error.message });
        }
    }

    async deleteHistorial(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await historialMedicoService.eliminarHistorial(parseInt(id));
            
            res.json({ msg: 'Historial actualizado a inactivo correctamente' });
        } catch (error: any) {
            const status = error.message === 'Historial no encontrado' ? 404 : 500;
            res.status(status).json({ error: error.message });
        }
    }
}

export const historialMedicoController = new HistorialMedicoController();