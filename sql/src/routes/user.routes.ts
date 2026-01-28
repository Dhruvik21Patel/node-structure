import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import validate from '../middlewares/validate.middleware';
import { updateUserSchema } from '../validations/user.validation';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (Protected Routes)
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users with filtering and pagination
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page.
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter users by email (partial match).
 *       - in: query
 *         name: first_name
 *         schema:
 *           type: string
 *         description: Filter users by first name (partial match).
 *       - in: query
 *         name: last_name
 *         schema:
 *           type: string
 *         description: Filter users by last name (partial match).
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *         description: Filter users by status (true or false).
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: The updated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put('/:id', validate(updateUserSchema), userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete('/:id', userController.deleteUser);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *           nullable: true
 *         status:
 *           type: boolean
 */