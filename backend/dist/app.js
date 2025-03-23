"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./models/server"));
require('./models/associations');
const connection_1 = require("./db/connection");
dotenv_1.default.config();
const server = new server_1.default();
(0, connection_1.syncDatabase)()
    .then(() => {
    server.listen();
})
    .catch(err => {
    console.error('Error al iniciar la aplicación:', err);
});
//# sourceMappingURL=app.js.map