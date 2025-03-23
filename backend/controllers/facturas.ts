import { Request, Response } from 'express';



import Factura from '../models/factura';
import CitaMedica from '../models/cita_medica';
import Usuario from '../models/usuario';
import Medico from '../models/medico';

export async function eliminarFactura(req: Request, res: Response) {

    const { id } = req.params;
  
    try {
        const factura = await Factura.findByPk(id);

        if (!factura) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Factura no encontrada'
            });
        }

        // Cambiar el estado de la factura a 'inactivo'
        factura.estado = 'inactivo';
        await factura.save();

        res.json({
            ok: true,
            mensaje: 'Factura actualizada a inactivo con éxito'
        });
    } catch (error) {
        console.error('Error al actualizar el estado de la factura:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor'
        });
    }
};

export async function getAllFacturas(req: Request, res: Response) {
    try {
        // Parámetros de paginación
        const desde = Number(req.query.desde) || 0;
        const limite = 5; 

        // Contar el total de facturas
        const totalFacturas = await Factura.count();

        // Obtener las facturas con paginación
        const facturas = await Factura.findAll({
            include: [{
                model: CitaMedica,
                as: 'citaMedica',
                include: [
                    {
                        model: Usuario,
                        as: 'paciente',
                        attributes: ['rut', 'nombre', 'apellidos']
                    },
                    {
                        model: Medico,
                        as: 'medico',
                        attributes: ['rut', 'nombre', 'apellidos']
                    }
                ],
                attributes: ['motivo']
            }],
            attributes: ['id_factura', 'payment_method_id', 'transaction_amount', 'monto_pagado', 'fecha_pago'],
            offset: desde,
            limit: limite
        });

        if (!facturas || facturas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron facturas' });
        }

        // Formatear las facturas para la respuesta
        const facturasFormateadas = facturas.map(factura => ({
            id_factura: factura.id_factura,
            payment_method_id: factura.payment_method_id,
            transaction_amount: factura.transaction_amount,
            monto_pagado: factura.monto_pagado,
            fecha_pago: factura.fecha_pago,
            citaMedica: {
                motivo: factura.citaMedica?.motivo,
                paciente: {
                    rut: factura.citaMedica?.paciente?.rut,
                    nombre: factura.citaMedica?.paciente?.nombre,
                    apellidos: factura.citaMedica?.paciente?.apellidos
                },
                medico: {
                    rut: factura.citaMedica?.medico?.rut,
                    nombre: factura.citaMedica?.medico?.nombre,
                    apellidos: factura.citaMedica?.medico?.apellidos
                }
            }
        }));

        // Enviar la respuesta
        res.json({
            ok: true,
            facturas: facturasFormateadas,
            total: totalFacturas
        });
    } catch (error) {
        console.error('Error al obtener las facturas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export async function obtenerFacturaPorId(req: Request, res: Response) {
    const id = req.params.id;
  
    const idfactura = parseInt(id);

    try {
        const factura = await Factura.findByPk(idfactura, {
            include: [{
                model: CitaMedica,
                as: 'citaMedica',
                include: [
                    {
                        model: Usuario,
                        as: 'paciente',
                        attributes: ['rut', 'nombre', 'apellidos']
                    },
                    {
                        model: Medico,
                        as: 'medico',
                        attributes: ['rut', 'nombre', 'apellidos']
                    }
                ],
                attributes: ['motivo']
            }],
            attributes: ['id_factura', 'payment_method_id', 'transaction_amount', 'monto_pagado', 'fecha_pago']
        });

        if (!factura) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Factura no encontrada'
            });
        }

        // Crear un objeto con la información detallada de la factura
        const facturaInfo = {
            idFactura: factura.id_factura,
            rutPaciente: factura.citaMedica?.paciente?.rut,
            nombrePaciente: factura.citaMedica?.paciente?.nombre,
            apellidosPaciente: factura.citaMedica?.paciente?.apellidos,
            motivoCita: factura.citaMedica?.motivo,
            rutMedico: factura.citaMedica?.medico?.rut,
            nombreMedico: factura.citaMedica?.medico?.nombre,
            apellidosMedico: factura.citaMedica?.medico?.apellidos,
            paymentMethodId: factura.payment_method_id,
            transactionAmount: factura.transaction_amount,
            montoPagado: factura.monto_pagado,
            fecha_pago: factura.fecha_pago
        };

        res.json({
            ok: true,
            factura: facturaInfo
        });
    } catch (error) {
        console.error('Error al obtener la factura:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor'
        });
    }


};




