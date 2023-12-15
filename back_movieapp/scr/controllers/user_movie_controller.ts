import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '../DataBase';

function printError(error: unknown, res: Response<any, Record<string, any>>) {
    let message = 'An error occurred, but it is not an instance of Error.';
    if (error instanceof Error) message = `An error occurred: ${error.message}`;
    console.error(message);
    return res.status(500).json('Internal Server Error.')
}
const API_KEY = '08c6fb59f7c71d29805136fe34281282';

async function getActorsForMovie(movieId: number): Promise<any> {
    const response = await fetch(`http://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`);
    const data = await response.json();
    return data.cast.map((actor: any) => actor.name);
}

// Función para obtener detalles adicionales de una película por su ID
async function getMovieDetails(movieId: number): Promise<any> {
    const response = await fetch(`http://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
    const data = await response.json();
    const genres = data.genres.map((genre: any) => genre.name);

    const actors = await getActorsForMovie(movieId);

    return {
        id: data.id,
        title: data.title,
        overview: data.overview,
        release_date: data.release_date,
        genres: genres,
        movieActors: actors
    };
}

async function getAllMovieDetails(movieIds: number[]): Promise<any[]> {
    const promises = movieIds.map((movieId) => getMovieDetails(movieId));
    return Promise.all(promises);
}

export const getUserMovie = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response: QueryResult = await pool.query('select * from user_movie where user_id=$1', [req.usuario?.userId]);

        const moviesDetails = await getAllMovieDetails(response.rows.map(x => x.movie_id));

        return res.status(200).json(moviesDetails);
    } catch (error) {
        return printError(error, res);
    }
}

export const getUserMovieId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('select * from user_movie where movie_id = $1', [id]);
        if (!response.rows[0]?.movie_id)
            return res.status(200).json({});
        const movieDetails = await getMovieDetails(response.rows[0]?.movie_id);
        return res.status(200).json(movieDetails);
    } catch (error) {
        return printError(error, res);
    }
}

// export const getUserMovieUserId = async (req: Request, res: Response): Promise<Response> => {
//     try {
//         const id = parseInt(req.params.id);
//         const response: QueryResult = await pool.query('select * from user_movie where status = 1 and user_id = $1', [id]);
//         return res.status(200).json(response.rows);
//     } catch (error) {
//         return printError(error, res);
//     }
// }

export const deleteUserMovie = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('update user_movie set status = 0 where movie_id = $1 and status = 1 and user_id = $2', [id,req.usuario?.userId]);
        if (response.rowCount == 0) return res.status(500).json(`The record does not exist in the database`);
        return res.status(200).json(`ID ${id} deleted Successfully`);
    } catch (error) {
        return printError(error, res);
    }
}

export const createUserMovie = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { movie_id } = req.body;
        let response: QueryResult = await pool.query('select * from user_movie where status = 1 and user_id = $1 and movie_id = $2', [req.usuario?.userId, movie_id]);
        if (response.rowCount != 0) return res.status(500).json('Internal Server Error. The movie is associated with the user.');
        response = await pool.query('insert into user_movie (user_id, movie_id) values ($1, $2)', [req.usuario?.userId, movie_id]);
      
        if (response.rowCount === 0) return res.status(500).json('Internal Server Error. The record could not be created.');
        console.log("response",response)
        let res2 ={
            message: "Record created Successfully",
            body: {
                user: {
                    user_id: req.usuario?.userId,
                    movie_id
                }
            }
        };
        console.log("awef",res2)
        return res.status(200).json(res2);
    } catch (error) {
        return printError(error, res);
    }
}
