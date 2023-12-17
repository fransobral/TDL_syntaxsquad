import { Router } from "express";
import { createUserMovie, deleteUserMovie, getUserMovie, getUserMovieId} from '../controllers/user_movie_controller'
import { verificarToken } from "../controllers/authService_controller";

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *     Favorite:
 *      type: object
 *      properties:
 *          movie_id:
 *              type: int
 *      required:
 *          - movie_id
 *      example:
 *          movie_id: 323445
 */

/**
 * @swagger
 * paths:
 *  /api/favoriteMovie:
 *    get:
 *      summary: Get favorite movies
 *      tags: [Favorite]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Favorite'
 *        401:
 *          description: Unauthorized - Invalid token
 *        500:
 *          description: Internal Server Error
 */
router.get('/favoriteMovie', verificarToken, getUserMovie);

/**
 * @swagger
 * /api/favoriteMovie:
 *     post:
 *      summary: Create a new favorite movie
 *      tags: [Favorite]
 *      requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                    type: object
 *                    $ref: '#/components/schemas/Favorite'
 *      responses:
 *          200:
 *             description: new favorite created!
 */
router.post('/favoriteMovie', verificarToken, createUserMovie);
/**
 * @swagger
 *components:
 *  schemas:
 *    MovieIds:
 *      type: array
 *      items:
 *        type: integer
 *      example: [323445, 567890]
*/

/**
 * @swagger
 *paths:
 *  /api/favoriteMovie/{id}:
 *    get:
 *      summary: Get favorite movie by ID
 *      tags: [Favorite]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the favorite movie
 *          schema:
 *            type: integer
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Favorite'
 *        401:
 *          description: Unauthorized - Invalid token
 *        404:
 *          description: Recommended movie not found
 *        500:
 *          description: Internal Server Error
 */
router.get('/favoriteMovie/:id', verificarToken, getUserMovieId);

/**
 * @swagger
 *paths:
 *  /api/favoriteMovie/{id}:
 *    delete:
 *      summary: Delete favorite movie by ID
 *      tags: [Favorite]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the favorite movie
 *          schema:
 *            type: integer
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Favorite'
 *        401:
 *          description: Unauthorized - Invalid token
 *        404:
 *          description: Recommended movie not found
 *        500:
 *          description: Internal Server Error
 */
router.delete('/favoriteMovie/:id', verificarToken, deleteUserMovie);

export default router;