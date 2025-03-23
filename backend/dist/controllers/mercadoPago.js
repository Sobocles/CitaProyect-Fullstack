"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveWebhook = exports.createOrder = void 0;
const mercadopago_1 = __importDefault(require("mercadopago"));
const factura_1 = __importDefault(require("../models/factura"));
const cita_medica_1 = __importDefault(require("../models/cita_medica"));
const medico_1 = __importDefault(require("../models/medico"));
const usuario_1 = __importDefault(require("../models/usuario"));
const emails_1 = __importDefault(require("../helpers/emails"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    mercadopago_1.default.configure({
        access_token: 'APP_USR-4655127474104645-110520-a5b6fd70292cb7889f38a9132bb7b08f-1537929468',
    });
    /*  const { motivo, precio, idCita } = req.body; */
    const motivo = req.body.motivo; // o cualquier otro tipo que se espera aquí
    const precio = req.body.precio;
    const idCita = req.body.idCita;
    console.log(motivo);
    console.log(precio);
    console.log(idCita);
    const preference = {
        items: [
            {
                title: motivo,
                unit_price: precio,
                currency_id: 'CLP',
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
        const result = yield mercadopago_1.default.preferences.create(preference);
        console.log('aqui esta el resultado', result);
        res.send(result.response);
    }
    catch (error) {
        const e = error;
        console.log('aqui el error', e);
        res.status(500).send(e.message);
    }
});
exports.createOrder = createOrder;
const receiveWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('aqui esta el req.query', req.query);
    try {
        const paymentIdStr = req.query["data.id"];
        const paymentType = req.query.type;
        console.log('aqui el', paymentIdStr);
        console.log('y aca tambien', paymentType);
        if (paymentType === "payment" && paymentIdStr) {
            const paymentIdNum = parseInt(paymentIdStr, 10);
            if (!isNaN(paymentIdNum)) {
                const paymentData = yield mercadopago_1.default.payment.findById(paymentIdNum);
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
                        payment_status: response.status,
                        status_detail: response.status_detail,
                        monto_pagado: response.transaction_amount,
                        estado_pago: response.status === 'approved' ? 'completado' : 'pendiente',
                        fecha_pago: new Date(fechaAprobacionPago)
                    };
                    console.log('AQUI ESTA LA FACTURA', facturaData);
                    // Guardar en la base de datos
                    const nuevaFactura = yield factura_1.default.create(facturaData);
                    console.log('Nueva factura creada:', nuevaFactura);
                    if (response.status === 'approved') {
                        yield cita_medica_1.default.update({ estado: 'pagado' }, { where: { idCita: facturaData.id_cita } });
                    }
                    const cita = yield cita_medica_1.default.findOne({
                        where: { idCita: facturaData.id_cita },
                        include: [{
                                model: medico_1.default,
                                as: 'medico',
                            }, {
                                model: usuario_1.default,
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
                            yield emails_1.default.instance.enviarConfirmacionCita(detallesCita);
                            console.log('Correo de confirmación enviado al paciente:', detallesCita.emailPaciente);
                        }
                        catch (error) {
                            console.error('Error al enviar correo de confirmación:', error);
                        }
                    }
                    res.sendStatus(200);
                }
                else {
                    // Manejar situaciones donde la respuesta no es exitosa
                    console.error('Payment not found or error with payment data');
                    res.sendStatus(404);
                }
            }
            else {
                // Manejar el caso donde paymentId no es un número válido
                console.error('Invalid payment ID');
                res.sendStatus(400);
            }
        }
        else {
            // Manejar otros casos, como cuando paymentType no es 'payment'
            console.error('Not a payment type or missing payment ID');
            res.sendStatus(400);
        }
    }
    catch (error) {
        console.error('Error in receiveWebhook:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.receiveWebhook = receiveWebhook;
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
//# sourceMappingURL=mercadoPago.js.map