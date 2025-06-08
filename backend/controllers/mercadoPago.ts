import { Request, Response } from 'express';
import mercadopago from "mercadopago";

import { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model';
import Factura from '../models/factura'; 
import tipo_cita from '../models/tipo_cita';
import CitaMedica from '../models/cita_medica';
import Medico from '../models/medico';
import Usuario from '../models/usuario';
import Email from '../helpers/emails';
import db from '../db/connection';


export const createOrder = async (req: Request, res: Response) => {
  console.log("ENTRO A CREATE ORDER");
  mercadopago.configure({
    access_token: 'TEST-884031095793760-111819-b2ad3ea11301ffbeab5f5eaef06ad47f-293343090',
  });

  const { motivo, precio, idCita } = req.body;

  try {
    // Crear preferencia de pago con auto_return
    const preference: CreatePreferencePayload = {
      items: [
        {
          title: motivo,
          unit_price: precio,
          currency_id: 'CLP',
          quantity: 1,
        }
      ],
      external_reference: idCita.toString(),
      back_urls: {
        success: `https://5d39-2800-150-14e-1f21-4807-a76f-df08-dd8b.ngrok-free.app/payment-success?idCita=${idCita}`,
        failure: "https://5d39-2800-150-14e-1f21-4807-a76f-df08-dd8b.ngrok-free.app/payment-failure",
        pending: "https://5d39-2800-150-14e-1f21-4807-a76f-df08-dd8b.ngrok-free.app/api/mercadoPago/pending"
      },
      notification_url: 'https://685c-2800-150-14e-1f21-4807-a76f-df08-dd8b.ngrok-free.app/api/mercadoPago/webhook',
      
      // AÑADIR AUTO_RETURN PARA REDIRECCIÓN AUTOMÁTICA
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    
    res.json({
      ok: true,
      id: response.body.id,
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point
    });

  } catch (error) {
    const err = error as Error;
    console.error('Error en createOrder:', err);
    res.status(500).json({
      error: 'Error al generar el link de pago',
      detalle: err.message
    });
  }
};

// Update your receiveWebhook function in controllers/mercadoPago.ts

export const receiveWebhook = async (req: Request, res: Response) => {
 
  console.log('===== WEBHOOK RECIBIDO =====');
  console.log('Método:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body); // Agrega esto para ver el cuerpo completo

  try {
    let paymentId: number;
    let idCita: number;

    // 1. Solo procesar notificaciones de tipo 'payment'
    if (req.body.type === 'payment') {
      paymentId = Number(req.body.data.id);
      console.log('Payment ID recibido:', paymentId);

      // 2. Obtener pago con reintentos mejorados
      const payment = await obtenerPagoConReintentos(paymentId, 10, 5000); // 10 reintentos, 5 segundos
      console.log("aqui el payment",payment);
      console.log("aqui el payment",payment.status);
      // 3. Validar external_reference críticamente
      idCita = parseInt(payment.external_reference, 10);
      if (isNaN(idCita)) {
        throw new Error(`External reference inválido: ${payment.external_reference}`);
      }

      // 4. Procesar solo si está aprobado
      if (payment.status === 'approved') {
        await procesarPagoExitoso(paymentId, idCita, payment.transaction_amount);
      }
    }

    res.status(200).send('OK');
  } catch (error: any) {
    console.error('Error crítico en webhook:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(200).send('OK'); // Siempre responder OK a MP
  }
};

// ========= Funciones Auxiliares Mejoradas =========

async function procesarMerchantOrder(merchantOrderId: string) {
  await new Promise(resolve => setTimeout(resolve, 3000));
  const merchantOrder = await mercadopago.merchant_orders.findById(merchantOrderId);
  console.log("merchantOrder",merchantOrder);
  if (!merchantOrder.body.payments?.length) {
    console.log('Orden sin pagos asociados');
    return null;
  }

  const payment = merchantOrder.body.payments[0];
  console.log("payment",payment);
  return {
    paymentId: Number(payment.id),
    idCita: parseInt(merchantOrder.body.external_reference, 10)
  };
}

async function obtenerPagoConReintentos(paymentId: number, maxRetries = 10, baseDelay = 5000) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const { body } = await mercadopago.payment.findById(paymentId);
      // CORRECIÓN: Mostrar el ID del pago, no el body completo
      console.log(`✅ Pago ${paymentId} obtenido en intento ${retries + 1}`);
      console.log(`Status del pago: ${body.status}`);
      console.log(`External reference: ${body.external_reference}`);
      return body;
    } catch (error: any) {
      if (error.status === 404) {
        const delay = baseDelay * Math.pow(2, retries);
        console.log(`⌛ Reintento ${retries + 1}/${maxRetries} en ${delay}ms para pago ${paymentId}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        retries++;
      } else {
        console.error('Error diferente a 404:', error);
        throw error;
      }
    }
  }
  throw new Error(`❌ Pago ${paymentId} no encontrado después de ${maxRetries} intentos`);
}
async function procesarPagoExitoso(paymentId: number, idCita: number, montoPagado: number) {
  console.log("entro a la funcion de pago exitoso");
  const transaction = await db.transaction();
  
  try {
    // 1. Obtener cita con relaciones necesarias (INCLUYENDO MÉDICO)
    const cita = await CitaMedica.findByPk(idCita, {
      include: [
        { 
          association: 'tipoCita',
          attributes: ['precio', 'especialidad_medica'] 
        },
        {
          association: 'paciente',
          attributes: ['email', 'nombre']
        },
        {
          association: 'medico', // AÑADIR MÉDICO
          attributes: ['nombre', 'apellidos']
        }
      ],
      transaction
    });

    // Verificación temprana de cita nula
    if (!cita || !cita.tipoCita || !cita.medico) {
      throw new Error(`Cita ${idCita} no encontrada o sin datos necesarios`);
    }

    // 2. Validar monto
    if (montoPagado !== cita.tipoCita.precio) {
      throw new Error(`Monto discrepante. Esperado: $${cita.tipoCita.precio}, Recibido: $${montoPagado}`);
    }

    // 3. Crear factura
    const factura = await Factura.create({
      id_cita: idCita,
      payment_method_id: 'mercado_pago',
      transaction_amount: cita.tipoCita.precio,
      monto_pagado: montoPagado,
      payment_status: 'approved',
      estado_pago: 'pagado',
      fecha_pago: new Date(),
      estado: 'activo'
    }, { transaction });

    // 4. Actualizar estado de la cita
    await cita.update({ estado: 'pagado' }, { transaction });

    // 5. Enviar confirmación por correo (si hay email válido)
    if (cita.paciente && cita.paciente.email) {
      try {
        // Formatear fecha correctamente
        const fechaFormateada = cita.fecha.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        await Email.instance.enviarConfirmacionCita({
          emailPaciente: cita.paciente.email, // NOMBRE CORRECTO
          pacienteNombre: cita.paciente.nombre, // NOMBRE CORRECTO
          fecha: fechaFormateada,
          hora_inicio: cita.hora_inicio,
          medicoNombre: `${cita.medico.nombre} ${cita.medico.apellidos}`,
          especialidad: cita.tipoCita.especialidad_medica
        });
      } catch (emailError) {
        console.error('Error al enviar correo (no crítico):', emailError);
      }
    } else {
      console.warn('No se envió correo: paciente sin email válido');
    }

    // 6. Commit de la transacción
    await transaction.commit();
    console.log(`Pago ${paymentId} procesado. Factura ID: ${factura.id_factura}`);

  } catch (error) {
    await transaction.rollback();
    console.error('Error en transacción:', error);
    throw error;
  }
}
    
