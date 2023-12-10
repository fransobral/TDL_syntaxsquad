import { Router } from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from '../controllers/users_controller'

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *     User:
 *      type: object
 *      properties:
 *          email:
 *              type: string
 *              description: the user email
 *          password:
 *              type: string
 *              description: the user password
 *          created:
 *              type: date
 *              description: the user created
 *          status:
 *              type: int
 *              description: the user status
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
 *      summary: return all users
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
router.get('/users', getUsers);


/**
 * @swagger
 * /api/users/{id}:
 *     get:
 *      summary: return a user
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
router.get('/users/:id', getUserById);

/**
 * @swagger
 * /api/users:
 *     post:
 *      summary: created new user
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
router.post('/users', createUser);

/**
 * @swagger
 * /api/users/{id}:
 *     put:
 *      summary: update a user
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
router.put('/users/:id', updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *     delete:
 *      summary: delete a user
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
router.delete('/users/:id', deleteUser);

export default router;