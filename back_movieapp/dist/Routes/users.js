"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users_controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *  schemas:
 *     User:
 *      type: object
 *      properties:
 *          email:
 *              type: string
 *          password:
 *              type: string
 *          created:
 *              type: date
 *          status:
 *              type: int
 *      required:
 *          - email
 *          - password
 *      example:
 *          email: test@gmail.com
 *          password: 1234qwer
 */
/**
 * @swagger
 * /api/users:
 *     get:
 *      summary: Return all users
 *      tags: [User]
 *      responses:
 *          200:
 *              description: all users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 */
router.get('/users', users_controller_1.getUsers);
/**
 * @swagger
 * /api/users/{id}:
 *     get:
 *      summary: Return a user
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: the user id
 *      responses:
 *          200:
 *              description: a user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *          404:
 *              description: user not found
 */
router.get('/users/:id', users_controller_1.getUserById);
/**
 * @swagger
 * /api/users:
 *     post:
 *      summary: Created new user
 *      tags: [User]
 *      requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                    type: object
 *                    $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *             description: new user created!
 */
router.post('/users', users_controller_1.createUser);
/**
 * @swagger
 * /api/users/{id}:
 *     put:
 *      summary: Update a user
 *      tags: [User]
 *      requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                    type: object
 *                    $ref: '#/components/schemas/User'
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: the user id
 *      responses:
 *          200:
 *              description: user update
 *          404:
 *              description: user not found
 */
router.put('/users/:id', users_controller_1.updateUser);
/**
 * @swagger
 * /api/users/{id}:
 *     delete:
 *      summary: Delete a user
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: the user id
 *      responses:
 *          200:
 *              description: user deleted
 *          404:
 *              description: user not found
 */
router.delete('/users/:id', users_controller_1.deleteUser);
exports.default = router;
