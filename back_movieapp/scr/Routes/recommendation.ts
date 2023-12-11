import { Router } from "express";
import {
    getRecommendedMovies, getRecommendationsByYears
} from '../controllers/recommendation_controller'

const router = Router();


/**
 * @swagger
 * /api/recommendations/{userId}:
 *     get:
 *      summary: Returns recommendations based on the movies saved in the user's My Favorites (if any).
 *      tags: [Recommendation]
 *      parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: string
 *            required: true
 *            description: the user id
 *      responses:
 *          200:
 *              description: user recommendation
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 */
router.get('/recommendations/:userId', getRecommendedMovies);

/**
 * @swagger
 * /api/recommendationsByYears/{userId}:
 *     get:
 *      summary: Returns recommendations based on the year of the movies saved in the user's My Favorites (if they have them).
 *      tags: [Recommendation]
 *      parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *              type: string
 *            required: true
 *            description: the user id
 *      responses:
 *          200:
 *              description: user recommendation
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 */
router.get('/recommendationsByYears/:userId', getRecommendationsByYears);


export default router;