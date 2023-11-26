import express from 'express';
import usersRoutes from './Routes/users';
import userMovieRoutes from './Routes/user_movie';
import moviesRoutes from './Routes/movies';
//import { DataBase } from './DataBasee';

//const db = new DataBase();
const app = express();
const port = 3000


app.use(express.json()); // Permite convertir los datos que lleguen a formato json
app.use(express.urlencoded({extended: false})); // Si se envia los datos de un form, permite convertirlo en formato json

app.use(usersRoutes);
app.use(userMovieRoutes);
app.use(moviesRoutes);

app.listen(port, () => {
console.log('\nProyecto up !\nPuerto:' + port + "\n")
})