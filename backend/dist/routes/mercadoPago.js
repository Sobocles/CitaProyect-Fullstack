"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mercadoPago_1 = require("../controllers/mercadoPago");
const facturas_1 = require("../controllers/facturas");
const router = (0, express_1.Router)();
router.post('/create-order', mercadoPago_1.createOrder);
router.get('/success', (req, res) => res.send('success'));
router.get('/failure', (req, res) => res.send('failure'));
router.get('/pending', (req, res) => res.send('pending'));
router.post('/webhook', mercadoPago_1.receiveWebhook);
router.get('/factura', facturas_1.getAllFacturas);
router.get('/factura/:id', facturas_1.obtenerFacturaPorId);
exports.default = router;
//# sourceMappingURL=mercadoPago.js.map