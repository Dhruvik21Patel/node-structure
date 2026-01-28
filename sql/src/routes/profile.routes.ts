import { authMiddleware } from "../middlewares/auth.middleware";
import { myProfile } from "../controllers/profile.controller";
import { Router } from "express";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Profile management (Protected Routes)
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
 * /api/profile/me:
 *   get:
 *     summary: Retrieve a current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
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
router.get("/me", authMiddleware, myProfile);

export default router;
