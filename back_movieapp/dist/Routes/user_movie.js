"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_movie_controller_1 = require("../controllers/user_movie_controller");
const authService_controller_1 = require("../controllers/authService_controller");
const router = (0, express_1.Router)();
router.get('/user_movie', user_movie_controller_1.getUserMovie);
/**
 * @swagger
 * /user_movie/user:
 *     get:
 *      summary: Retrieve all user favorite movies.
 *      responses:
 *          200:
 *              description: user favorite movies
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 */
router.get('/user_movie/user', authService_controller_1.verificarToken, user_movie_controller_1.getUserMovieUserId);
router.post('/user_movie', user_movie_controller_1.createUserMovie);
router.get('/user_movie/:id', user_movie_controller_1.getUserMovieId);
router.delete('/user_movie/:id', user_movie_controller_1.deleteUserMovie);
exports.default = router;
