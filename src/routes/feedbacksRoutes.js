import express from 'express';
import FeedbacksController from '../controllers/feedbacksController.js';
import AuthMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Todas as rotas de feedbacks são protegidas
router.use(AuthMiddleware.authenticate);

// Rotas CRUD para feedbacks
router.get('/', FeedbacksController.index);           // GET /api/feedbacks - Listar todos
router.get('/stats', FeedbacksController.stats);      // GET /api/feedbacks/stats - Estatísticas
router.get('/:id', FeedbacksController.show);         // GET /api/feedbacks/:id - Buscar por ID
router.post('/', FeedbacksController.store);          // POST /api/feedbacks - Criar novo
router.put('/:id', FeedbacksController.update);       // PUT /api/feedbacks/:id - Atualizar
router.delete('/:id', FeedbacksController.delete);    // DELETE /api/feedbacks/:id - Deletar

export default router;