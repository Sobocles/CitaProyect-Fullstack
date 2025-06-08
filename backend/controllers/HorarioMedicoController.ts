import { Request, Response } from 'express';
import horarioMedicoService from '../services/horario.medico.service';

export default class HorarioMedicoController {
    
    async getHorariosMedicos(req: Request, res: Response) {
        try {
            const desde = Number(req.query.desde) || 0;
            const limite = 5; // Fijo según tu código original

            const { count, rows: horarios } = await horarioMedicoService.getHorariosMedicos(desde, limite);

            res.json({
                ok: true,
                horarios,
                total: count
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getHorarioMedico(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const horario = await horarioMedicoService.getHorarioMedico(parseInt(id));

            if (!horario) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Horario no encontrado'
                });
            }

            res.json({
                ok: true,
                horario
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async crearHorarioMedico(req: Request, res: Response) {
        try {
            const horario = await horarioMedicoService.crearHorarioMedico(req.body);
            res.status(201).json({
                ok: true,
                horario
            });
        } catch (error: any) {
            res.status(400).json({
                ok: false,
                msg: error.message
            });
        }
    }

    async putHorarioMedico(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const horario = await horarioMedicoService.actualizarHorarioMedico(parseInt(id), req.body);
            
            res.json({
                ok: true,
                msg: 'Horario actualizado correctamente',
                horario
            });
        } catch (error: any) {
            const status = error.message === 'Horario no encontrado' ? 404 : 400;
            res.status(status).json({ error: error.message });
        }
    }

    async deleteHorarioMedico(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await horarioMedicoService.eliminarHorarioMedico(parseInt(id));
            
            res.json({ msg: 'Horario eliminado correctamente' });
        } catch (error: any) {
            const status = error.message === 'Horario no encontrado' ? 404 : 500;
            res.status(status).json({ error: error.message });
        }
    }
}

export const horarioMedicoController = new HorarioMedicoController();