import express from 'express';
import SetoresController from '../controllers/setoresController.js';
import AuthMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Todas as rotas de setores são protegidas
router.use(AuthMiddleware.authenticate);

// Rotas CRUD para setores
router.get('/', SetoresController.index);           // GET /api/setores - Listar todos
router.get('/:id', SetoresController.show);         // GET /api/setores/:id - Buscar por ID
router.post('/', SetoresController.store);          // POST /api/setores - Criar novo
router.put('/:id', SetoresController.update);       // PUT /api/setores/:id - Atualizar
router.delete('/:id', SetoresController.delete);    // DELETE /api/setores/:id - Deletar

export default router;