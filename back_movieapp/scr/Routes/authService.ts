import { Router } from "express";
import {
    loginEndpoint
} from '../controllers/authService_controller'

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *     Login:
 *      type: object
 *      properties:
 *          userName:
 *              type: string
 *          password:
 *              type: string
 *      required:
 *          - userName
 *          - password
 */

/**
 * @swagger
 * /api/Login/:
 *     post:
 *      summary: log in | Get token
 *      tags: [Login]
 *      requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                    type: object
 *                    $ref: '#/components/schemas/Login'
 *      responses:
 *          200:
 *              description: login successful
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 */
router.post('/Login', loginEndpoint);

export default router;