import HistorialMedico from '../models/historial_medico';
import { Op, IncludeOptions } from 'sequelize';

export class HistorialMedicoRepository {
    async findAndCountAll(options: any) {
        return HistorialMedico.findAndCountAll(options);
    }

    async findByPk(id_historial: number, options?: any) {
        return HistorialMedico.findByPk(id_historial, options);
    }

    async findOne(options: any) {
        return HistorialMedico.findOne(options);
    }

    async create(historialData: any) {
        return HistorialMedico.create(historialData);
    }

    async update(historial: HistorialMedico, historialData: any) {
        return historial.update(historialData);
    }

    async count(options: any) {
        return HistorialMedico.count(options);
    }
}

export default new HistorialMedicoRepository();