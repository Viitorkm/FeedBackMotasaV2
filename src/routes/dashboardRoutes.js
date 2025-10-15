import express from 'express';
import DashboardController from '../controllers/dashboardController.js';
import AuthMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Todas as rotas do dashboard são protegidas
router.use(AuthMiddleware.authenticate);

// Rotas do dashboard
router.get('/', DashboardController.index);  // GET /api/dashboard
router.get('/colaboradores-setor', DashboardController.contarColaboradoresSetor);  // GET /api/dashboard/colaboradores-setor
router.get('/feedbacks-setor', DashboardController.contarFeedbacksSetor);  // GET /api/dashboard/feedbacks-setor
router.get('/avaliacoes-setor', DashboardController.contarAvaliacoesSetor);  // GET /api/dashboard/avaliacoes-setor
router.get('/media-desempenho-setor', DashboardController.mediaDesempenhoSetor);  // GET /api/dashboard/media-desempenho-setor
router.get('/media-desempenho-setor-mes', DashboardController.mediaDesempenhoSetorMes);  // GET /api/dashboard/media-desempenho-setor-mes

export default router;