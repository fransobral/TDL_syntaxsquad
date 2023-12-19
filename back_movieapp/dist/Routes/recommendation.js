"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recommendation_controller_1 = require("../controllers/recommendation_controller");
const authService_controller_1 = require("../controllers/authService_controller");
const router = (0, express_1.Router)();
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
router.get('/recommendations', authService_controller_1.verificarToken, recommendation_controller_1.getRecommendedMovies);
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
router.get('/recommendationsPlus', authService_controller_1.verificarToken, recommendation_controller_1.getRecommendationsByYears);
exports.default = router;
