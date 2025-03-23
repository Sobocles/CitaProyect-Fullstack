import { Request, Response } from 'express';
import mercadopago from "mercadopago";

import { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model';
import Factura from '../models/factura'; 
import CitaMedica from '../models/cita_medica';
import Medico from '../models/medico';
import Usuario from '../models/usuario';
import Email from '../helpers/emails';



export const createOrder = async (req: Request, res: Response) => {
    mercadopago.configure({
        access_token: 'APP_USR-4655127474104645-110520-a5b6fd70292cb7889f38a9132bb7b08f-1537929468',
      });
    
    /*  const { motivo, precio, idCita } = req.body; */

    const motivo: string = req.body.motivo; // o cualquier otro tipo que se espera aquí
    const precio: number = req.body.precio;
    const idCita: number = req.body.idCita;
      console.log(motivo);
      console.log(precio);
      console.log(idCita);

    const preference: CreatePreferencePayload = {
      items: [
        {
          title: motivo,
          unit_price: precio,
          currency_id: 'CLP', // Aquí asegúrate que el valor es uno de los valores permitidos por MercadoPago
          quantity: 1,
        }
      ],
  
      //success: "http://localhost:8000/api/mercadoPago/success",
      external_reference: `${idCita}`,
      
      back_urls: {
        success: `http://localhost:4200/payment-success?idCita=${idCita}`,
        failure: "http://localhost:4200/payment-failure",
        pending: "http://localhost:8000/api/mercadoPago/pending"
      },

    
   
      //.\ngrok.exe http 8000
      //.\ngrok http --region=sa 8000
      //.\ngrok http --region=us 8000

      notification_url: 'https://d261-2800-150-14e-fe7-a1af-e042-20d9-b0e0.ngrok.io/api/mercadoPago/webhook'
    };
  
    
    try {
      const result = await mercadopago.preferences.create(preference);
      console.log('aqui esta el resultado',result);
      res.send(result.response);
    } catch (error) {
      const e = error as { message: string };
      console.log('aqui el error',e);
      res.status(500).send(e.message);
    }
};


export const receiveWebhook = async (req: Request, res: Response) => {
  console.log('aqui esta el req.query',req.query);
  try {
    const paymentIdStr: string = req.query["data.id"] as string;
    const paymentType: string = req.query.type as string;

    console.log('aqui el',paymentIdStr);
    console.log('y aca tambien',paymentType);

    if (paymentType === "payment" && paymentIdStr) {
      const paymentIdNum = parseInt(paymentIdStr, 10);
      if (!isNaN(paymentIdNum)) {
        const paymentData = await mercadopago.payment.findById(paymentIdNum);
        console.log('Payment Data:', paymentData);

        // Aquí se asume que la respuesta de MercadoPago viene en el formato esperado
        if (paymentData.status === 200 && paymentData.response) {
          const { response } = paymentData;
          const fechaAprobacionPago = response.date_approved;
          // Crear el objeto factura con los datos relevantes
          const facturaData = {
            id_cita: parseInt(response.external_reference, 10),
            payment_method_id: response.payment_method_id,
            transaction_amount: response.transaction_amount,
            payment_status: response.status, // Asumiendo que 'status' es un campo válido
            status_detail: response.status_detail,
            monto_pagado: response.transaction_amount, // Asumiendo que esto es el monto pagado
            estado_pago: response.status === 'approved' ? 'completado' : 'pendiente',
            fecha_pago: new Date(fechaAprobacionPago)
          };

          console.log('AQUI ESTA LA FACTURA',facturaData);

          // Guardar en la base de datos
          const nuevaFactura = await Factura.create(facturaData);
          console.log('Nueva factura creada:', nuevaFactura);

          if (response.status === 'approved') {
            await CitaMedica.update(
              { estado: 'pagado' },
              { where: { idCita: facturaData.id_cita } }
            );
          }

          const cita = await CitaMedica.findOne({
            where: { idCita: facturaData.id_cita },
            include: [{
              model: Medico,
              as: 'medico', 
            }, {
              model: Usuario,
              as: 'paciente',
            }]
          });
        
        
          if (cita && cita.medico && cita.paciente) {
            // Preparar los detalles para el correo electrónico
            const detallesCita = {
              fecha: cita.fecha,
              hora_inicio: cita.hora_inicio,
              medicoNombre: `${cita.medico.nombre} ${cita.medico.apellidos}`,
              especialidad: cita.medico.especialidad_medica,
              pacienteNombre: `${cita.paciente.nombre} ${cita.paciente.apellidos}`,
              emailPaciente: cita.paciente.email, 
          
            };
            
          
            try {
              await Email.instance.enviarConfirmacionCita(detallesCita);
              console.log('Correo de confirmación enviado al paciente:', detallesCita.emailPaciente);
            } catch (error) {
              console.error('Error al enviar correo de confirmación:', error);
            }
          }

          

          res.sendStatus(200);
        } else {
          // Manejar situaciones donde la respuesta no es exitosa
          console.error('Payment not found or error with payment data');
          res.sendStatus(404);
        }
      } else {
        // Manejar el caso donde paymentId no es un número válido
        console.error('Invalid payment ID');
        res.sendStatus(400);
      }
    } else {
      // Manejar otros casos, como cuando paymentType no es 'payment'
      console.error('Not a payment type or missing payment ID');
      res.sendStatus(400);
    }
  } catch (error: any) {
    console.error('Error in receiveWebhook:', error);
    res.status(500).json({ error: error.message });
  }
};

    
 
    
    /*
    //ESTA FUNCION ESCUCHA EVENTOS QUE LLEGAN DESDE MERCADO PAGO
/*
export const receiveWebhook = async (req: Request, res: Response) => {
  try {
    console.log('Webhook received:', req.query);
    const eventId: string = req.query.id as string;
    const eventType: string = req.query.topic as string;

    console.log('Event Type:', eventType); 
    console.log('Event ID String:', eventId);

    if (eventType === "merchant_order" && eventId) {
      const eventIdNum = parseInt(eventId, 10);
      console.log('Event ID Number:', eventIdNum);  

      if (!isNaN(eventIdNum)) {
        const orderData = await mercadopago.merchant_orders.findById(eventIdNum);
        console.log('Order Data:', orderData);

        // Aquí se asume que la respuesta de MercadoPago viene en el formato esperado
        if (orderData.status === 200 && orderData.response) {
          const { response } = orderData;
          console.log('aqui la respuesta',response);
          const fechaAprobacionPago = response.date_approved;
          // Crear el objeto factura con los datos relevantes
          const facturaData = {
            id_cita: parseInt(response.external_reference, 10),
            payment_method_id: response.payment_method_id,
            transaction_amount: response.transaction_amount,
            payment_status: response.status, // Asumiendo que 'status' es un campo válido
            status_detail: response.status_detail,
            monto_pagado: response.transaction_amount, // Asumiendo que esto es el monto pagado
            estado_pago: response.status === 'approved' ? 'completado' : 'pendiente',
            fecha_pago: new Date(fechaAprobacionPago)
          };

          console.log('AQUI ESTA LA FACTURA',facturaData);

          // Guardar en la base de datos
          const nuevaFactura = await Factura.create(facturaData);
          console.log('Nueva factura creada:', nuevaFactura);

          if (response.status === 'approved') {
            await CitaMedica.update(
              { estado: 'pagado' },
              { where: { idCita: facturaData.id_cita } }
            );
          }

          const cita = await CitaMedica.findOne({
            where: { idCita: facturaData.id_cita },
            include: [{
              model: Medico,
              as: 'medico', 
            }, {
              model: Usuario,
              as: 'paciente',
            }]
          });
        
        
          if (cita && cita.medico && cita.paciente) {
            // Preparar los detalles para el correo electrónico
            const detallesCita = {
              fecha: cita.fecha,
              hora_inicio: cita.hora_inicio,
              medicoNombre: `${cita.medico.nombre} ${cita.medico.apellidos}`,
              especialidad: cita.medico.especialidad_medica,
              pacienteNombre: `${cita.paciente.nombre} ${cita.paciente.apellidos}`,
              emailPaciente: cita.paciente.email, 
          
            };
            
          
            try {
              await Email.instance.enviarConfirmacionCita(detallesCita);
              console.log('Correo de confirmación enviado al paciente:', detallesCita.emailPaciente);
            } catch (error) {
              console.error('Error al enviar correo de confirmación:', error);
            }
          }

          

          res.sendStatus(200);
        } else {
          // Manejar situaciones donde la respuesta no es exitosa
          console.error('Payment not found or error with payment data');
          res.sendStatus(404);
        }
      } else {
        // Manejar el caso donde paymentId no es un número válido
        console.error('Invalid payment ID');
        res.sendStatus(400);
      }
    } else {
      // Manejar otros casos, como cuando paymentType no es 'payment'
      console.error('Not a payment type or missing payment ID');
      res.sendStatus(400);
    }
  } catch (error: any) {
    console.error('Error in receiveWebhook:', error);
    res.status(500).json({ error: error.message });
  }
};



    export const receiveWebhook = async (req: Request, res: Response) => {
        console.log(req.query);

        res.send("webhook");

    };


    */