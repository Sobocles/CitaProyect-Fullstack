import tipoCitaRepository from '../repositories/TipoCitaRepository';
import { Op, Sequelize } from 'sequelize';
import Medico from '../models/medico';
import CitaMedica from '../models/cita_medica';
import HorarioMedic from '../models/horario_medico';
import db from '../db/connection';
import { CrearTipoCitaDto, ActualizarTipoCitaDto } from '../dtos/tipo-cita.dto';

export class TipoCitaService {
  // Métodos para especialidades
  async getAllEspecialidades() {
    return tipoCitaRepository.findActiveEspecialidades();
  }

  async getEspecialidadesDisponibles() {
    try {
      const query = `
        SELECT DISTINCT tc.especialidad_medica
        FROM tipocitas tc
        WHERE tc.estado = 'activo' 
        AND tc.especialidad_medica IS NOT NULL
        AND tc.especialidad_medica != ''
        AND EXISTS (
          SELECT 1 
          FROM medicos m 
          INNER JOIN horarioMedicos hm ON m.rut = hm.rut_medico
          WHERE m.estado = 'activo'
          AND m.especialidad_medica = tc.especialidad_medica
        )
        ORDER BY tc.especialidad_medica
      `;
      
      const [results] = await db.query(query);
      return results as { especialidad_medica: string }[];
    } catch (error) {
      console.error("Error getting available specialties", error);
      return this.getAllEspecialidades();
    }
  }

  // Métodos CRUD para tipos de cita
  async getTipoCitas(desde: number, limite: number) {
    return tipoCitaRepository.findAndCountAll({
      where: { estado: 'activo' },
      offset: desde,
      limit: limite
    });
  }

  async getTipoCita(id: number) {
    return tipoCitaRepository.findByPk(id);
  }

  async crearTipoCita(tipoCitaData: CrearTipoCitaDto) {
    const normalizedData = {
      ...tipoCitaData,
      especialidad_medica: this.normalizarEspecialidad(tipoCitaData.especialidad_medica || '')
    };

    const exists = await tipoCitaRepository.findOne({
      where: { 
        especialidad_medica: normalizedData.especialidad_medica,
        estado: 'activo'
      }
    });

    if (exists) {
      throw new Error(`La especialidad '${normalizedData.especialidad_medica}' ya está registrada`);
    }

    return tipoCitaRepository.create(normalizedData);
  }

  async actualizarTipoCita(id: number, tipoCitaData: ActualizarTipoCitaDto) {
    const tipoCita = await tipoCitaRepository.findByPk(id);
    if (!tipoCita) throw new Error('Tipo de cita no encontrado');
    
    return tipoCitaRepository.update(id, tipoCitaData);
  }

  async eliminarTipoCita(id: number) {
    const tipoCita = await tipoCitaRepository.desactivar(id);
    if (!tipoCita) throw new Error('Tipo de cita no encontrado');
    
    if (tipoCita.especialidad_medica) {
      await this.eliminarHorariosPorEspecialidad(tipoCita.especialidad_medica);
    }

    return tipoCita;
  }

  private async eliminarHorariosPorEspecialidad(especialidad: string) {
    try {
      // 1. Desactivar médicos
      await Medico.update(
        { estado: 'inactivo' },
        { where: { especialidad_medica: especialidad } }
      );

      // 2. Actualizar citas
      await CitaMedica.update(
        { estado_actividad: 'inactivo' },
        {
          where: {
            rut_medico: {
              [Op.in]: Sequelize.literal(`(SELECT rut FROM medicos WHERE especialidad_medica = '${especialidad}')`)
            },
            estado: { [Op.in]: ['terminado', 'no_pagado', 'no_asistio'] }
          }
        }
      );

      // 3. Eliminar horarios
      const horarios = await HorarioMedic.findAll({
        attributes: ['idHorario'],
        include: [{ 
          model: Medico,
          as: 'medico',
          where: { especialidad_medica: especialidad }
        }]
      }) as unknown as { idHorario: number }[];

      const ids = horarios.map(h => h.idHorario);
      
      if (ids.length > 0) {
        await HorarioMedic.destroy({
          where: { 
            idHorario: { 
              [Op.in]: ids 
            } 
          } as any
        });
      }
    } catch (error) {
      console.error("Error eliminando horarios por especialidad", error);
      throw new Error('Error al desactivar elementos relacionados');
    }
  }

  private normalizarEspecialidad(especialidad: string): string {
    return especialidad
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }
}

export default new TipoCitaService();