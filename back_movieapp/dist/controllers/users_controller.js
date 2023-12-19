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
exports.createUser = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = void 0;
const DataBase_1 = require("../DataBase");
function printError(error, res) {
    let message = 'An error occurred, but it is not an instance of Error.';
    if (error instanceof Error)
        message = `An error occurred: ${error.message}`;
    console.error(message);
    return res.status(500).json('Internal Server Error.');
}
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield DataBase_1.pool.query('select id, email, created from users where status = 1 order by id asc');
        return res.status(200).json(response.rows);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield DataBase_1.pool.query('select id, email, created from users where status = 1 and id = $1', [id]);
        return res.status(200).json(response.rows[0]);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { email, password } = req.body;
        if (email == undefined || password == undefined)
            return res.status(500).json("Internal Server Error. Email and password must be submitted to apply the update.");
        const otherUser = yield DataBase_1.pool.query('select * from users where status = 1 and email = $1 and id != $2', [email, id]);
        if (otherUser.rowCount != 0)
            return res.status(500).json(`There is another user with email`);
        const response = yield DataBase_1.pool.query('update users set email = $1, password = $2 where status = 1 and id = $3', [email, password, id]);
        if (response.rowCount == 0)
            return res.status(500).json(`The record does not exist in the database`);
        return res.status(200).json(`User ${id} update Successfully`);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield DataBase_1.pool.query('update users set status = 0 where status = 1 and id = $1', [id]);
        if (response.rowCount == 0)
            return res.status(500).json(`The record does not exist in the database`);
        return res.status(200).json(`User ${id} deleted Successfully`);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.deleteUser = deleteUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const response = yield DataBase_1.pool.query('select id, email, created from users where status = 1 and email = $1', [email]);
        if (response.rowCount != 0)
            return res.status(500).json('Internal Server Error. There is an account with that email.');
        yield DataBase_1.pool.query('insert into users (email, password) values ($1, $2)', [email, password]);
        return res.status(200).json({
            message: "User created Successfully",
            body: {
                user: {
                    email,
                    password
                }
            }
        });
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.createUser = createUser;
