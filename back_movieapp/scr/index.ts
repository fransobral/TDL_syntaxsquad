import express from 'express';
import usersRoutes from './Routes/users';
import userMovieRoutes from './Routes/user_movie';
import moviesRoutes from './Routes/movies';
import recommendationRoute from './Routes/recommendation';
import loginRoute from './Routes/authService';

const app = express();
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
        ],components: {
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

app.use(express.json()); // Permite convertir los datos que lleguen a formato json
app.use(express.urlencoded({ extended: false })); // Si se envia los datos de un form, permite convertirlo en formato json

app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJSDoc(swaggerSpec)));

app.use('/api', usersRoutes);
app.use('/api', userMovieRoutes);
app.use('/api', moviesRoutes);
app.use('/api', recommendationRoute);
app.use('/api', loginRoute);

app.listen(port, () => {
    console.log('\nProyecto up !\nPuerto:' + port + "\n");
    console.log("Go to: " + domain + "/api-doc")
})