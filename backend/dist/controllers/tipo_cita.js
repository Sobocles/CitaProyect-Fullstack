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
exports.tipoCitaController = exports.TipoCitaController = void 0;
const tipocita_service_1 = __importDefault(require("../services/tipocita.service"));
class TipoCitaController {
    // Métodos para especialidades
    getAllEspecialidades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const especialidades = yield tipocita_service_1.default.getAllEspecialidades();
                res.json({ especialidades });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getEspecialidades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const especialidades = yield tipocita_service_1.default.getEspecialidadesDisponibles();
                res.json({ especialidades });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    // Métodos CRUD para tipos de cita
    getTipoCitas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const desde = Number(req.query.desde) || 0;
                const limite = 5;
                const { count, rows: tipo_cita } = yield tipocita_service_1.default.getTipoCitas(desde, limite);
                res.json({
                    ok: true,
                    tipo_cita,
                    total: count
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getTipoCita(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const tipoCita = yield tipocita_service_1.default.getTipoCita(parseInt(id));
                if (!tipoCita) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Tipo de cita no encontrado'
                    });
                }
                res.json({
                    ok: true,
                    tipoCita
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    crearTipoCita(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tipoCitaData = req.body;
                const tipoCita = yield tipocita_service_1.default.crearTipoCita(tipoCitaData);
                res.status(201).json({
                    ok: true,
                    tipoCita
                });
            }
            catch (error) {
                res.status(400).json({
                    ok: false,
                    msg: error.message
                });
            }
        });
    }
    putTipoCita(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const tipoCitaData = req.body;
                const tipoCita = yield tipocita_service_1.default.actualizarTipoCita(parseInt(id), tipoCitaData);
                res.json({
                    ok: true,
                    msg: 'Tipo de cita actualizado correctamente',
                    tipoCita
                });
            }
            catch (error) {
                const status = error.message === 'Tipo de cita no encontrado' ? 404 : 400;
                res.status(status).json({ error: error.message });
            }
        });
    }
    deleteTipoCita(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const tipoCita = yield tipocita_service_1.default.eliminarTipoCita(parseInt(id));
                res.json({
                    ok: true,
                    msg: 'Tipo de cita desactivado correctamente',
                    tipoCita
                });
            }
            catch (error) {
                const status = error.message === 'Tipo de cita no encontrado' ? 404 : 500;
                res.status(status).json({ error: error.message });
            }
        });
    }
}
exports.TipoCitaController = TipoCitaController;
exports.tipoCitaController = new TipoCitaController();
//# sourceMappingURL=tipo_cita.js.map