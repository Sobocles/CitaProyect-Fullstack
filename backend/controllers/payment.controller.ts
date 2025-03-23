import axios from 'axios';
import { Request, Response } from 'express';
import { HOST, PAYPAL_API, PAYPAL_API_CLIENT, PAYPAL_API_SECRET } from '../global/enviorenment';

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { appointmentPrice } = req.body; // Suponiendo que envías el precio de la cita desde el front-end
       console.log('aqui esta el precio',appointmentPrice);
      
      

        const order = {
            intent: "CAPTURE",
            purchase_units: [{
                amount: {
                    currency_code: "CLP",
                    value: appointmentPrice,
                },
            }],
            application_context: {
                brand_name: "cita medica",
                landing_page: "NO_PREFERENCE",
                user_action: "PAY_NOW",
                return_url: "http://localhost:8000/api/paypal/capture-order",

                cancel_url: `${HOST}/cancel-payment`,
            },
        };


        if (!PAYPAL_API_CLIENT || !PAYPAL_API_SECRET) {
            console.error('Faltan las credenciales de PayPal.');
            return res.status(500).json({ message: 'Error del servidor' });
        }

        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");

        // Genera un token de acceso
        const { data: { access_token } } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`,params,
            {
                auth: {
                    username: PAYPAL_API_CLIENT,
                    password: PAYPAL_API_SECRET,
                },
            }
        );
       
        // Crea la orden
        const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, order, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })

    
        return res.json(response.data);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Algo salió mal" });
    }
};

export const captureOrder = async (req:Request, res:Response) => {
    const { token } = req.query;
    console.log(token);

    if (!PAYPAL_API_CLIENT || !PAYPAL_API_SECRET) {
        console.error('Faltan las credenciales de PayPal.');
        return res.status(500).json({ message: 'Error del servidor' });
    }
    
      const response = await axios.post(
        `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,{},{
          auth: {
            username: PAYPAL_API_CLIENT,
            password: PAYPAL_API_SECRET,
          },
        }
      );
  
      console.log(response.data);

      return res.send('payed');
  
   
  };

export const cancelPayment = (req: Request, res: Response) => res.send("cancelPayment created");


