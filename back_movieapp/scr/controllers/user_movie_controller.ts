import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '../database';

function printError(error: unknown, res: Response<any, Record<string, any>>) {
    let message = 'An error occurred, but it is not an instance of Error.';
    if (error instanceof Error) message = `An error occurred: ${error.message}`;
    console.error(message);
    return res.status(500).json('Internal Server Error.')
}

export const getUserMovie = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response: QueryResult = await pool.query('select * from user_movie');
        return res.status(200).json(response.rows);
    } catch (error) {
        return printError(error, res);
    }
}

export const getUserMovieId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('select * from user_movie where id = $1', [id]);
        return res.status(200).json(response.rows);
    } catch (error) {
        return printError(error, res);
    }
}

export const getUserMovieUserId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        console.log(id)
        const response: QueryResult = await pool.query('select * from user_movie where status = 1 and user_id = $1', [id]);
        return res.status(200).json(response.rows);
    } catch (error) {
        return printError(error, res);
    }
}

export const deleteUserMovie = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('update user_movie set status = 0 where id = $1', [id]);
        if(response.rowCount == 0) return res.status(500).json(`The record does not exist in the database`);
        return res.status(200).json(`ID ${id} deleted Successfully`);
    } catch (error) {
        return printError(error, res);
    }
}

export const createUserMovie = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { user_id, movie_id } = req.body;

        let response: QueryResult = await pool.query('select * from user_movie where status = 1 and user_id = $1 and movie_id = $2', [user_id, movie_id]);
        if (response.rowCount != 0) return res.status(500).json('Internal Server Error. The movie is associated with the user.');

        response = await pool.query('insert into user_movie (user_id, movie_id) values ($1, $2)', [user_id, movie_id]);
        if (response.rowCount != 0) return res.status(500).json('Internal Server Error. The record could not be created.');

        return res.status(200).json({
            message: "Record created Successfully",
            body: {
                user: {
                    user_id,
                    movie_id
                }
            }
        });
    } catch (error) {
        return printError(error, res);
    }
}
