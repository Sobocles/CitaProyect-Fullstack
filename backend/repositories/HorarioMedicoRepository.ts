import HorarioMedic from '../models/horario_medico';
import { Op } from 'sequelize';

export class HorarioMedicoRepository {
    async findAll(options: any) {
        return HorarioMedic.findAndCountAll(options);
    }

    async findByPk(idHorario: number, options?: any) {
        return HorarioMedic.findByPk(idHorario, options);
    }

    async create(horarioData: any) {
        return HorarioMedic.create(horarioData);
    }

    async update(horario: HorarioMedic, horarioData: any) {
        return horario.update(horarioData);
    }

    async destroy(horario: HorarioMedic) {
        return horario.destroy();
    }

    async findOverlappingSchedules(rut_medico: string, diaSemana: string, horaInicio: string, horaFinalizacion: string, excludeId?: number) {
        const where: any = {
            rut_medico,
            diaSemana,
            [Op.or]: [
                {
                    horaInicio: {
                        [Op.lt]: horaFinalizacion,
                        [Op.ne]: horaFinalizacion
                    },
                    horaFinalizacion: {
                        [Op.gt]: horaInicio
                    }
                },
                {
                    horaInicio: {
                        [Op.lt]: horaFinalizacion
                    },
                    horaFinalizacion: {
                        [Op.gt]: horaInicio,
                        [Op.ne]: horaInicio
                    }
                }
            ]
        };

        if (excludeId) {
            where.idHorario = { [Op.ne]: excludeId };
        }

        return HorarioMedic.findAll({ where });
    }
}

export default new HorarioMedicoRepository();