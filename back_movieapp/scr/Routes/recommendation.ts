import { Router } from "express";
import {
    getRecommendedMovies, getRecommendationsByYears
} from '../controllers/recommendation_controller'
import {
    verificarToken
} from '../controllers/authService_controller'

const router = Router();


/**
 * @swagger
 * /api/recommendations:
 *     get:
 *      summary: Returns recommendations based on the movies saved in the user's My Favorites (if any).
 *      tags: [Recommendation]
 *      parameters:
 *          - in: query
 *            name: recommendationQuantity
 *            schema:
 *              type: integer
 *            required: false
 *            default: 10
 *            description: The number of recommendations
 *      responses:
 *          200:
 *              description: user recommendation
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 */
router.get('/recommendations',verificarToken, getRecommendedMovies);

/**
 * @swagger
 * /api/recommendationsPlus:
 *     get:
 *      summary: Returns recommendations based on the year of the movies saved in the user's My Favorites (if they have them).
 *      tags: [Recommendation]
 *      parameters:
 *          - in: query
 *            name: recommendationQuantity
 *            schema:
 *              type: integer
 *            required: false
 *            default: 10
 *            description: The number of recommendations
 *      responses:
 *          200:
 *              description: user recommendation
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 */
router.get('/recommendationsPlus',verificarToken, getRecommendationsByYears);


export default router;