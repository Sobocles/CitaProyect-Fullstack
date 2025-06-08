// src/repositories/TipoCitaRepository.ts
import { Op } from 'sequelize';
import TipoCita from '../models/tipo_cita';

export class TipoCitaRepository {
  async findAndCountAll(options: any) {
    return TipoCita.findAndCountAll(options);
  }

  async findByPk(id: number) {
    return TipoCita.findByPk(id);
  }

  async findOne(options: any) {
    return TipoCita.findOne(options);
  }

  async create(tipoCitaData: any) {
    return TipoCita.create(tipoCitaData);
  }

  async update(id: number, tipoCitaData: any) {
    const tipoCita = await TipoCita.findByPk(id);
    if (!tipoCita) return null;
    return tipoCita.update(tipoCitaData);
  }

  async desactivar(id: number) {
    const tipoCita = await TipoCita.findByPk(id);
    if (!tipoCita) return null;
    return tipoCita.update({ estado: 'inactivo' });
  }

  async findActiveEspecialidades() {
    return TipoCita.findAll({
      attributes: ['especialidad_medica'],
      where: {
        especialidad_medica: { [Op.ne]: null },
        estado: 'activo'
      },
      group: ['especialidad_medica'],
      order: [['especialidad_medica', 'ASC']]
    });
  }
}

export default new TipoCitaRepository();