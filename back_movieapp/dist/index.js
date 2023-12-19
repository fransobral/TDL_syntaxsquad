"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./Routes/users"));
const user_movie_1 = __importDefault(require("./Routes/user_movie"));
const movies_1 = __importDefault(require("./Routes/movies"));
const rated_movie_1 = __importDefault(require("./Routes/rated_movie"));
const recommendation_1 = __importDefault(require("./Routes/recommendation"));
const authService_1 = __importDefault(require("./Routes/authService"));
const app = (0, express_1.default)();
const port = 3000;
const domain = "http://localhost:" + port;
const path = require("path");
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Movie APP",
            version: "1.0.0"
        },
        servers: [
            {
                url: domain
            }
        ], components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: [] // Nombre del esquema de seguridad que definiste arriba
            }
        ]
    },
    apis: [`${path.join(__dirname, "./Routes/*.js")}`]
};
app.use(express_1.default.json()); // Permite convertir los datos que lleguen a formato json
app.use(express_1.default.urlencoded({ extended: false })); // Si se envia los datos de un form, permite convertirlo en formato json
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJSDoc(swaggerSpec)));
app.use('/api', users_1.default);
app.use('/api', user_movie_1.default);
app.use('/api', movies_1.default);
app.use('/api', rated_movie_1.default);
app.use('/api', recommendation_1.default);
app.use('/api', authService_1.default);
app.listen(port, () => {
    console.log('\nProyecto up !\nPuerto:' + port + "\n");
    console.log("Go to: " + domain + "/api-doc");
});
