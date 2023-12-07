import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '../DataBase';

function printError(error: unknown, res: Response<any, Record<string, any>>) {
    let message = 'An error occurred, but it is not an instance of Error.';
    if (error instanceof Error) message = `An error occurred: ${error.message}`;
    console.error(message);
    return res.status(500).json('Internal Server Error.')
}

export const getRatedMovie = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response: QueryResult = await pool.query('select * from rated_movie order by id asc');
        return res.status(200).json(response.rows);
    } catch (error) {
        return printError(error, res);
    }
}

export const getRatedMovieById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('select * from rated_movie where id = $1', [id]);
        return res.status(200).json(response.rows[0]);
    } catch (error) {
        return printError(error, res);
    }
}

export const getRatedMovieByUserId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('select * from rated_movie where status = 1 and user_id = $1', [id]);
        return res.status(200).json(response.rows);
    } catch (error) {
        return printError(error, res);
    }
}

export const updateRatedMovie = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const { liked } = req.body;

        if (liked == undefined) return res.status(500).json("Internal Server Error. Liked must be submitted to apply the update.");

        const response: QueryResult = await pool.query('update rated_movie set liked = $1 where id = $2', [liked, id]);
        if (response.rowCount == 0) return res.status(500).json(`The record does not exist in the database`);

        return res.status(200).json(`Record ${id} update Successfully`);
    } catch (error) {
        return printError(error, res);
    }
}

export const deleteRatedMovie = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('update rated_movie set status = 0 where id = $1', [id]);

        if (response.rowCount == 0) return res.status(500).json(`The record does not exist in the database`);

        return res.status(200).json(`Record ${id} deleted Successfully`);
    } catch (error) {
        return printError(error, res);
    }
}

export const createRatedMovie = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { user_id, movie_id, liked } = req.body;
        const response: QueryResult = await pool.query('select * from rated_movie where status = 1 and movie_id = $1', [movie_id]);
        if (response.rowCount != 0) return res.status(500).json('Internal Server Error. Repeated record.');
        await pool.query('insert into rated_movie (user_id, movie_id, liked) values ($1, $2, $3)', [user_id, movie_id, liked]);

        return res.status(200).json({
            message: "Record created Successfully",
            body: {
                record: {
                    user_id,
                    movie_id,
                    liked
                }
            }
        });
    } catch (error) {
        return printError(error, res);
    }
}
