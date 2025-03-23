"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MERCADOPAGO_API_KEY = exports.HOST = exports.PAYPAL_API = exports.PAYPAL_API_SECRET = exports.PAYPAL_API_CLIENT = exports.SECRET_JWT = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.PORT = Number(process.env.PORT) || 8000;
exports.SECRET_JWT = 'TU3R3SM1S3cr3t0';
exports.PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT;
exports.PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET;
exports.PAYPAL_API = 'https://api-m.sandbox.paypal.com';
exports.HOST = "http://localhost:8000/api/paypal";
exports.MERCADOPAGO_API_KEY = "TEST-2801152513044896-110516-5b600403b6f71cf7cb7bce9d5bbe43e7-1537636004";
//# sourceMappingURL=enviorenment.js.map