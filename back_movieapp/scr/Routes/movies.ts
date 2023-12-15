import { Router } from "express";
import {
    getMovieByName,
    getMoviesByActor,
    getMoviesByGenre,
    getMoviesByNationality,
    getMoviesByYear,
    getTopMoviesByActor,
    getTopMoviesByGenre,
    getTopMoviesByNationality,
    getTopMoviesByYear
} from '../controllers/movies_controller'
import { verificarToken } from "../controllers/authService_controller";

const router = Router();

/**
 * @swagger
 * /api/movies/name:
 *   get:
 *     summary: Get movie by name
 *     description: Retrieves information about a movie by its name from an external API.
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: name
 *         description: Name of the movie
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful response with movie information
 *         schema:
 *           type: object
 *           properties:
 *             // Aquí debes especificar la estructura del objeto de respuesta basado en la información que devuelve la API externa
 *       500:
 *         description: Error response
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message indicating the issue
 */
router.get('/movies/name',verificarToken, getMovieByName);

/**
 * @swagger
 * /api/movies/actor:
 *   get:
 *     summary: Get movies by actor
 *     description: Retrieves movies based on an actor's name from an external API.
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: name
 *         description: Name of the actor
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful response with movies featuring the actor
 *         schema:
 *           type: array
 *           items:
 *             // Aquí debes especificar la estructura del objeto de película devuelto por la API externa
 *       500:
 *         description: Error response
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message indicating the issue
 */
router.get('/movies/actor',verificarToken, getMoviesByActor);

/**
 * @swagger
 * /api/movies/top_actor:
 *   get:
 *     summary: Get top movies by actor
 *     description: Retrieves top movies featuring an actor based on the actor's name from an external API.
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: name
 *         description: Name of the actor
 *         required: true
 *         type: string
 *       - in: query
 *         name: top
 *         description: Number of top movies to retrieve
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successful response with top movies featuring the actor
 *         schema:
 *           type: array
 *           items:
 *             // Aquí debes especificar la estructura del objeto de película devuelto por la API externa
 *       500:
 *         description: Error response
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message indicating the issue
 */
router.get('/movies/top_actor',verificarToken, getTopMoviesByActor);

/**
 * @swagger
 * /api/movies/year:
 *   get:
 *     summary: Get movies by year
 *     description: Retrieves movies released in a specific year from an external API.
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: year
 *         description: Year of movie release
 *         required: true
 *         type: integer
 *         format: int32
 *     responses:
 *       200:
 *         description: Successful response with movies released in the specified year
 *         schema:
 *           type: array
 *           items:
 *             // Aquí debes especificar la estructura del objeto de película devuelto por la API externa
 *       500:
 *         description: Error response
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message indicating the issue
 */
router.get('/movies/year',verificarToken, getMoviesByYear);

/**
 * @swagger
 * /api/movies/top_year:
 *   get:
 *     summary: Get top movies by year
 *     description: Retrieves top movies released in a specific year from an external API.
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: year
 *         description: Year of movie release
 *         required: true
 *         type: integer
 *         format: int32
 *       - in: query
 *         name: top
 *         description: Number of top movies to retrieve
 *         required: true
 *         type: integer
 *         format: int32
 *     responses:
 *       200:
 *         description: Successful response with top movies released in the specified year
 *         schema:
 *           type: array
 *           items:
 *             // Aquí debes especificar la estructura del objeto de película devuelto por la API externa
 *       500:
 *         description: Error response
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message indicating the issue
 */
router.get('/movies/top_year',verificarToken, getTopMoviesByYear);


router.get('/movies/nationality', getMoviesByNationality);
router.get('/movies/top_nationality', getTopMoviesByNationality);

/**
 * @swagger
 * /api/movies/genre:
 *   get:
 *     summary: Get movies by genre
 *     description: Retrieves movies based on a specific genre from an external API.
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: genre
 *         description: Genre ID of the movies
 *         required: true
 *         type: integer
 *         format: int32
 *     responses:
 *       200:
 *         description: Successful response with movies matching the specified genre
 *         schema:
 *           type: array
 *           items:
 *             // Aquí debes especificar la estructura del objeto de película devuelto por la API externa
 *       500:
 *         description: Error response
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message indicating the issue
 */
router.get('/movies/genre',verificarToken, getMoviesByGenre);

/**
 * @swagger
 * /api/movies/top_genre:
 *   get:
 *     summary: Get top movies by genre
 *     description: Retrieves top movies of a specific genre from an external API.
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: genre
 *         description: Genre ID of the movies
 *         required: true
 *         type: integer
 *         format: int32
 *       - in: query
 *         name: top
 *         description: Number of top movies to retrieve
 *         required: true
 *         type: integer
 *         format: int32
 *     responses:
 *       200:
 *         description: Successful response with top movies of the specified genre
 *         schema:
 *           type: array
 *           items:
 *             // Aquí debes especificar la estructura del objeto de película devuelto por la API externa
 *       500:
 *         description: Error response
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Error message indicating the issue
 */
router.get('/movies/top_genre',verificarToken, getTopMoviesByGenre);

export default router;