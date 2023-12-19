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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRatedMovie = exports.deleteRatedMovie = exports.updateRatedMovie = exports.getRatedMovieByUserId = exports.getRatedMovieById = exports.getRatedMovie = void 0;
const DataBase_1 = require("../DataBase");
function printError(error, res) {
    let message = 'An error occurred, but it is not an instance of Error.';
    if (error instanceof Error)
        message = `An error occurred: ${error.message}`;
    console.error(message);
    return res.status(500).json('Internal Server Error.');
}
const getRatedMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield DataBase_1.pool.query('select * from rated_movie order by id asc');
        return res.status(200).json(response.rows);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getRatedMovie = getRatedMovie;
const getRatedMovieById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield DataBase_1.pool.query('select * from rated_movie where id = $1', [id]);
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getRatedMovieById = getRatedMovieById;
const getRatedMovieByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield DataBase_1.pool.query('select * from rated_movie where status = 1 and user_id = $1', [id]);
        return res.status(200).json(response.rows);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getRatedMovieByUserId = getRatedMovieByUserId;
const updateRatedMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { liked } = req.body;
        if (liked == undefined)
            return res.status(500).json("Internal Server Error. Liked must be submitted to apply the update.");
        const response = yield DataBase_1.pool.query('update rated_movie set liked = $1 where id = $2', [liked, id]);
        if (response.rowCount == 0)
            return res.status(500).json(`The record does not exist in the database`);
        return res.status(200).json(`Record ${id} update Successfully`);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.updateRatedMovie = updateRatedMovie;
const deleteRatedMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield DataBase_1.pool.query('update rated_movie set status = 0 where id = $1', [id]);
        if (response.rowCount == 0)
            return res.status(500).json(`The record does not exist in the database`);
        return res.status(200).json(`Record ${id} deleted Successfully`);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.deleteRatedMovie = deleteRatedMovie;
const createRatedMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, movie_id, liked } = req.body;
        const response = yield DataBase_1.pool.query('select * from rated_movie where status = 1 and movie_id = $1', [movie_id]);
        if (response.rowCount != 0)
            return res.status(500).json('Internal Server Error. Repeated record.');
        yield DataBase_1.pool.query('insert into rated_movie (user_id, movie_id, liked) values ($1, $2, $3)', [user_id, movie_id, liked]);
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
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.createRatedMovie = createRatedMovie;
