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
exports.loginEndpoint = exports.verificarToken = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DataBase_1 = require("../DataBase");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const secretKey = 'pepeGrilloPerroBonito123456789111111jacquelineoura';
function verifyCredentials(username, password) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const responseUser = yield DataBase_1.pool.query('SELECT * FROM users WHERE email = $1 AND status = $2 AND password = $3', [username, 1, password]);
            if (((_a = responseUser.rowCount) !== null && _a !== void 0 ? _a : 0) === 0) {
                return undefined;
            }
            return responseUser.rows[0];
        }
        catch (error) {
            console.error('Error al verificar credenciales:', error);
            throw error; // Propaga el error para que pueda ser manejado externamente si es necesario
        }
    });
}
const verificarToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }
    jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: 'Token inválido' });
        }
        req.usuario = decoded;
        console.log("USUARIO LOGEADO ->", req.usuario);
        next();
    });
};
exports.verificarToken = verificarToken;
// Función para generar un token JWT
function generateJWTToken(user) {
    const payload = {
        userId: user.id,
        username: user.email
    };
    const options = {
        expiresIn: '1h' // El token expirará en 1 hora
    };
    return jsonwebtoken_1.default.sign(payload, secretKey, options);
}
// import { Request, Response } from 'express';
// import { verifyCredentials, generateJWTToken } from './authService'; // Importa las funciones necesarias
const loginEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password } = req.body;
        const authenticatedUser = yield verifyCredentials(userName, password);
        if (authenticatedUser) {
            // Usuario autenticado, generamos un token JWT
            const authToken = generateJWTToken(authenticatedUser);
            //*********************** */
            //console.log(res.json({ token: authToken }));
            return res.json({ token: authToken });
        }
        else {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    }
    catch (error) {
        return res.status(500).json({ error: 'Error al autenticar usuario' });
    }
});
exports.loginEndpoint = loginEndpoint;
