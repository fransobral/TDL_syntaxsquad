"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authService_controller_1 = require("../controllers/authService_controller");
const router = (0, express_1.Router)();
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
router.post('/Login', authService_controller_1.loginEndpoint);
exports.default = router;
