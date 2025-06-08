import { Request, Response } from 'express';
import medicoService from '../services/medico.service';
import JwtGenerate from '../helpers/jwt';
import { UserRole } from '../types/enums';

export default class MedicosController {
    private static _instance: MedicosController;

    public static get instance() {
        return this._instance || (this._instance = new MedicosController());
    }

    async getMedicos(req: Request, res: Response) {
        const desde = Number(req.query.desde) || 0;
        try {
            const result = await medicoService.getPaginatedMedicos(desde);
            res.json({
                ok: true,
                medicos: result.medicos,
                total: result.total
            });
        } catch (error) {
            console.error('Error al obtener los médicos:', error);
            res.status(500).json({ msg: 'Error en el servidor' });
        }
    }

    async getMedicosEspecialidad(req: Request, res: Response) {
        try {
            const medicos = await medicoService.getMedicosByEspecialidad();
            res.json({
                ok: true,
                medicos
            });
        } catch (error) {
            console.error('Error al obtener médicos por especialidad:', error);
            res.status(500).json({ ok: false, msg: 'Error en el servidor' });
        }
    }

    async getAllMedicos(req: Request, res: Response) {
        try {
            const result = await medicoService.getAllMedicos();
            res.json({
                ok: true,
                medicos: result.medicos,
                total: result.total
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error en el servidor' });
        }
    }

    async getMedico(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const medico = await medicoService.getMedicoById(id);
            if (!medico) {
                return res.status(404).json({ ok: false, msg: 'Médico no encontrado' });
            }
            res.json({ ok: true, medico });
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, msg: 'Hable con el administrador' });
        }
    }

    async crearMedico(req: Request, res: Response) {
        try {
            const medico = await medicoService.createMedico(req.body);
            
            // Para el token, necesitamos el rol como string
            const medicoJSON: any = medico.toJSON();
            const rol = medicoJSON.rol?.codigo || UserRole.MEDICO;
            
            // Generar JWT
            const token = await JwtGenerate.instance.generarJWT(
                medico.rut, 
                medico.nombre, 
                medico.apellidos, 
                rol
            );
            
            res.json({
                ok: true,
                medico: medicoJSON,
                token
            });
        } catch (error: any) {
            res.status(400).json({ ok: false, msg: error.message });
        }
    }

    async putMedico(req: Request, res: Response) {
        const { rut } = req.params;
        try {
            const medico = await medicoService.updateMedico(rut, req.body);
            if (!medico) {
                return res.status(404).json({ ok: false, msg: 'Médico no encontrado' });
            }
            
            // Procesar para respuesta
            const medicoJSON: any = medico.toJSON();
            if (medicoJSON.rol && medicoJSON.rol.codigo) {
                medicoJSON.rol = medicoJSON.rol.codigo;
            }
            
            res.json({ ok: true, medico: medicoJSON });
        } catch (error: any) {
            res.status(400).json({ ok: false, msg: error.message });
        }
    }

    async deleteMedico(req: Request, res: Response) {
        const { rut } = req.params;
        try {
            await medicoService.deleteMedico(rut);
            res.json({ ok: true, msg: 'Médico eliminado correctamente' });
        } catch (error: any) {
            res.status(400).json({ ok: false, msg: error.message });
        }
    }

    async cambiarPasswordMedico(req: Request, res: Response) {
        const { rut, password, newPassword } = req.body;
        try {
            await medicoService.changePassword(rut, password, newPassword);
            res.json({ ok: true, msg: 'Contraseña actualizada correctamente' });
        } catch (error: any) {
            res.status(400).json({ ok: false, msg: error.message });
        }
    }
}