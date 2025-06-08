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
exports.historialMedicoController = void 0;
const historialmedico_service_1 = __importDefault(require("../services/historialmedico.service"));
class HistorialMedicoController {
    getHistoriales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { count, rows: historiales } = yield historialmedico_service_1.default.getHistoriales();
                res.json({ historiales });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getHistorial(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const desde = Number(req.query.desde) || 0;
                const limite = Number(req.query.limite) || 5;
                const { count, historiales } = yield historialmedico_service_1.default.getHistorialPaciente(id, desde, limite);
                if (count === 0) {
                    return res.status(200).json({
                        ok: true,
                        msg: 'No hay historiales activos para el paciente',
                        historiales: []
                    });
                }
                res.json({
                    ok: true,
                    historiales,
                    total: count
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getHistorialMedico(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const desde = Number(req.query.desde) || 0;
                const limite = Number(req.query.limite) || 5;
                const { count, historiales } = yield historialmedico_service_1.default.getHistorialMedico(id, desde, limite);
                if (count === 0) {
                    return res.status(200).json({
                        ok: true,
                        msg: 'No hay historiales activos para este médico',
                        historiales: []
                    });
                }
                res.json({
                    ok: true,
                    historiales,
                    total: count
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getHistorialPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const historial = yield historialmedico_service_1.default.getHistorialPorId(parseInt(id));
                if (!historial) {
                    return res.status(404).json({
                        msg: 'No se encontró el historial médico'
                    });
                }
                res.json(historial);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    crearHistorial(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const historial = yield historialmedico_service_1.default.crearHistorial(req.body);
                res.status(201).json({
                    ok: true,
                    historial
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
    putHistorial(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const historial = yield historialmedico_service_1.default.actualizarHistorial(parseInt(id), req.body);
                res.json({
                    ok: true,
                    msg: 'Historial actualizado correctamente',
                    historial
                });
            }
            catch (error) {
                const status = error.message === 'Historial no encontrado' ? 404 : 500;
                res.status(status).json({ error: error.message });
            }
        });
    }
    deleteHistorial(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield historialmedico_service_1.default.eliminarHistorial(parseInt(id));
                res.json({ msg: 'Historial actualizado a inactivo correctamente' });
            }
            catch (error) {
                const status = error.message === 'Historial no encontrado' ? 404 : 500;
                res.status(status).json({ error: error.message });
            }
        });
    }
}
exports.default = HistorialMedicoController;
exports.historialMedicoController = new HistorialMedicoController();
//# sourceMappingURL=historial_medico.js.map