import CitaMedica from '../models/cita_medica';
import { Op, IncludeOptions } from 'sequelize';
import { CitaMedicaAttributes } from '../models/cita_medica';

export class CitaRepository {
    async findAndCountAll(options: any) {
        return CitaMedica.findAndCountAll(options);
    }

    async findByPk(idCita: number, options?: any) {
        return CitaMedica.findByPk(idCita, options);
    }

    async findOne(options: any) {
        return CitaMedica.findOne(options);
    }

    async create(citaData: CitaMedicaAttributes) {
        return CitaMedica.create(citaData);
    }

    async update(cita: CitaMedica, citaData: Partial<CitaMedicaAttributes>) {
        return cita.update(citaData);
    }

    async count(options: any) {
        return CitaMedica.count(options);
    }

      async updateWhere(where: any, data: any) {
    return CitaMedica.update(data, { where });
  }
}

export default new CitaRepository();