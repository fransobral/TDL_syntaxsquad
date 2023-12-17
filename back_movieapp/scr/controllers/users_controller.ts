import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '../DataBase';

function printError(error: unknown, res: Response<any, Record<string, any>>) {
    let message = 'An error occurred, but it is not an instance of Error.';
    if (error instanceof Error) message = `An error occurred: ${error.message}`;
    console.error(message);
    return res.status(500).json('Internal Server Error.')
}



export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response: QueryResult = await pool.query('select id, email, created, admin from users where status = 1 order by id asc');
        return res.status(200).json(response.rows);
    } catch (error) {
        return printError(error, res);
    }
}

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('select id, email, created from users where status = 1 and id = $1', [id]);
        return res.status(200).json(response.rows[0]);
    } catch (error) {
        return printError(error, res);
    }
}

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const { email, password } = req.body;

        if (email == undefined || password == undefined) return res.status(500).json("Internal Server Error. Email and password must be submitted to apply the update.");

        const otherUser: QueryResult = await pool.query('select * from users where status = 1 and email = $1 and id != $2', [email, id]);
        if (otherUser.rowCount != 0) return res.status(500).json(`There is another user with email`);

        const response: QueryResult = await pool.query('update users set email = $1, password = $2 where status = 1 and id = $3', [email, password, id]);
        if (response.rowCount == 0) return res.status(500).json(`The record does not exist in the database`);

        return res.status(200).json(`User ${id} update Successfully`);
    } catch (error) {
        return printError(error, res);
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('update users set status = 0 where status = 1 and id = $1', [id]);

        if (response.rowCount == 0) return res.status(500).json(`The record does not exist in the database`);

        return res.status(200).json(`User id: ${id}has been deleted Successfully`);
    } catch (error) {
        return printError(error, res);
    }
}

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
   
        const response: QueryResult = await pool.query('select id, email created from users where status = 1 and email = $1', [email]);
        console.log(response);
        console.log("fin ");
        if (response.rowCount != 0) return res.status(500).json('Internal Server Error. There is an account with that email.');
        await pool.query('insert into users (email, password) values ($1, $2)', [email, password]);

        return res.status(200).json({
            message: "User created Successfully",
            body: {
                user: {
                    email,
                    password,                 
                }
            }
        });
    } catch (error) {
        return printError(error, res);
    }
}