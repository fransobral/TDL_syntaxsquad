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
exports.createUserMovie = exports.deleteUserMovie = exports.getUserMovieUserId = exports.getUserMovieId = exports.getUserMovie = void 0;
const DataBase_1 = require("../DataBase");
function printError(error, res) {
    let message = 'An error occurred, but it is not an instance of Error.';
    if (error instanceof Error)
        message = `An error occurred: ${error.message}`;
    console.error(message);
    return res.status(500).json('Internal Server Error.');
}
const getUserMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield DataBase_1.pool.query('select * from user_movie');
        return res.status(200).json(response.rows);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getUserMovie = getUserMovie;
const getUserMovieId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield DataBase_1.pool.query('select * from user_movie where id = $1', [id]);
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getUserMovieId = getUserMovieId;
const getUserMovieUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield DataBase_1.pool.query('select * from user_movie where status = 1 and user_id = $1', [(_a = req.usuario) === null || _a === void 0 ? void 0 : _a.userId]);
        return res.status(200).json(response.rows);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getUserMovieUserId = getUserMovieUserId;
const deleteUserMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield DataBase_1.pool.query('update user_movie set status = 0 where id = $1', [id]);
        if (response.rowCount == 0)
            return res.status(500).json(`The record does not exist in the database`);
        return res.status(200).json(`ID ${id} deleted Successfully`);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.deleteUserMovie = deleteUserMovie;
const createUserMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, movie_id } = req.body;
        let response = yield DataBase_1.pool.query('select * from user_movie where status = 1 and user_id = $1 and movie_id = $2', [user_id, movie_id]);
        if (response.rowCount != 0)
            return res.status(500).json('Internal Server Error. The movie is associated with the user.');
        response = yield DataBase_1.pool.query('insert into user_movie (user_id, movie_id) values ($1, $2)', [user_id, movie_id]);
        if (response.rowCount != 0)
            return res.status(500).json('Internal Server Error. The record could not be created.');
        return res.status(200).json({
            message: "Record created Successfully",
            body: {
                user: {
                    user_id,
                    movie_id
                }
            }
        });
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.createUserMovie = createUserMovie;
