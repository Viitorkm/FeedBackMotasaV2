import express from 'express';
import AuthController from '../controllers/authController.js';
import AuthMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Rotas públicas
router.post('/register', AuthController.register);  // POST /api/auth/register
router.post('/login', AuthController.login);        // POST /api/auth/login

// Rotas protegidas
router.get('/me', AuthMiddleware.authenticate, AuthController.me);  // GET /api/auth/me

export default router;