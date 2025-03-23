import { Secret } from "jsonwebtoken";
import { config } from "dotenv";
config();

export const PORT: number = Number(process.env.PORT) || 8000;

export const SECRET_JWT: Secret = 'TU3R3SM1S3cr3t0';

export const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT;

export const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET;

export const PAYPAL_API = 'https://api-m.sandbox.paypal.com';

export const HOST = "http://localhost:8000/api/paypal";

export const MERCADOPAGO_API_KEY = "TEST-2801152513044896-110516-5b600403b6f71cf7cb7bce9d5bbe43e7-1537636004";

