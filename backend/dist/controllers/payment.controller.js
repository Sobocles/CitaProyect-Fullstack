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
exports.cancelPayment = exports.captureOrder = exports.createOrder = void 0;
const axios_1 = __importDefault(require("axios"));
const enviorenment_1 = require("../global/enviorenment");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { appointmentPrice } = req.body; // Suponiendo que envías el precio de la cita desde el front-end
        console.log('aqui esta el precio', appointmentPrice);
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
                cancel_url: `${enviorenment_1.HOST}/cancel-payment`,
            },
        };
        if (!enviorenment_1.PAYPAL_API_CLIENT || !enviorenment_1.PAYPAL_API_SECRET) {
            console.error('Faltan las credenciales de PayPal.');
            return res.status(500).json({ message: 'Error del servidor' });
        }
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");
        // Genera un token de acceso
        const { data: { access_token } } = yield axios_1.default.post(`${enviorenment_1.PAYPAL_API}/v1/oauth2/token`, params, {
            auth: {
                username: enviorenment_1.PAYPAL_API_CLIENT,
                password: enviorenment_1.PAYPAL_API_SECRET,
            },
        });
        // Crea la orden
        const response = yield axios_1.default.post(`${enviorenment_1.PAYPAL_API}/v2/checkout/orders`, order, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        return res.json(response.data);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Algo salió mal" });
    }
});
exports.createOrder = createOrder;
const captureOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.query;
    console.log(token);
    if (!enviorenment_1.PAYPAL_API_CLIENT || !enviorenment_1.PAYPAL_API_SECRET) {
        console.error('Faltan las credenciales de PayPal.');
        return res.status(500).json({ message: 'Error del servidor' });
    }
    const response = yield axios_1.default.post(`${enviorenment_1.PAYPAL_API}/v2/checkout/orders/${token}/capture`, {}, {
        auth: {
            username: enviorenment_1.PAYPAL_API_CLIENT,
            password: enviorenment_1.PAYPAL_API_SECRET,
        },
    });
    console.log(response.data);
    return res.send('payed');
});
exports.captureOrder = captureOrder;
const cancelPayment = (req, res) => res.send("cancelPayment created");
exports.cancelPayment = cancelPayment;
//# sourceMappingURL=payment.controller.js.map