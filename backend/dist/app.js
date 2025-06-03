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
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./models/server"));
require('./models/associations');
const connection_1 = require("./db/connection");
const initializer_1 = require("./db/initializer");
dotenv_1.default.config();
const server = new server_1.default();
// Secuencia de inicio de la aplicación
function startApp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 1. Sincronizar base de datos
            yield (0, connection_1.syncDatabase)();
            console.log('Base de datos sincronizada correctamente');
            // 2. Inicializar datos básicos (roles, etc.)
            yield (0, initializer_1.initializeData)();
            // 3. Iniciar el servidor
            server.listen();
        }
        catch (err) {
            console.error('Error al iniciar la aplicación:', err);
            process.exit(1); // Terminar proceso con error
        }
    });
}
// Iniciar la aplicación
startApp();
//# sourceMappingURL=app.js.map