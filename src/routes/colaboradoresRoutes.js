import { Router } from 'express';
import colaboradoresController from '../controllers/colaboradoresController.js';
import AuthMiddleware from '../middlewares/auth.js';

const router = Router();

// Todas as rotas de colaboradores são protegidas
router.use(AuthMiddleware.authenticate);

// Rotas para colaboradores
router.get('/', colaboradoresController.index);           // Listar todos
router.get('/stats', colaboradoresController.stats);      // Estatísticas
router.get('/:id', colaboradoresController.show);         // Buscar por ID
router.post('/', colaboradoresController.store);          // Criar novo
router.put('/:id', colaboradoresController.update);       // Atualizar
router.delete('/:id', colaboradoresController.delete);    // Deletar

export default router;