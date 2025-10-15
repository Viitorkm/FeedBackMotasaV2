import express from 'express';
import FeedbacksController from '../controllers/feedbacksController.js';

const router = express.Router();

// Rotas CRUD para feedbacks
router.get('/', FeedbacksController.index);           // GET /api/feedbacks - Listar todos
router.get('/stats', FeedbacksController.stats);      // GET /api/feedbacks/stats - Estatísticas
router.get('/:id', FeedbacksController.show);         // GET /api/feedbacks/:id - Buscar por ID
router.post('/', FeedbacksController.store);          // POST /api/feedbacks - Criar novo
router.put('/:id', FeedbacksController.update);       // PUT /api/feedbacks/:id - Atualizar
router.delete('/:id', FeedbacksController.delete);    // DELETE /api/feedbacks/:id - Deletar

export default router;