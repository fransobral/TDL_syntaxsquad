import express from 'express';
import { DataBase } from './DataBase';

const app = express();
const port = 3000

app.listen(port, () => {
console.log('\nProyecto up !\nPuerto:' + port + "\n")
})

app.use(express.json()); // Permite convertir los datos que lleguen a formato json
app.use(express.urlencoded({extended: false})); // Si se envia los datos de un form, permite convertirlo en formato json

const db = new DataBase();
