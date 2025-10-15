import jwt from 'jsonwebtoken';
import database from '../database/index.js';

class AuthMiddleware {
  async authenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: 'Token de acesso não fornecido'
        });
      }

      const [, token] = authHeader.split(' ');

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token de acesso malformado'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Verificar se o usuário ainda existe e está ativo
      const usuario = await database.connection.models.Usuario.findOne({
        where: {
          id: decoded.id,
          ativo: true
        },
        include: {
          model: database.connection.models.Setor,
          as: 'setor',
          where: { ativo: true }
        }
      });

      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Token inválido'
        });
      }

      req.usuario = usuario;
      req.userId = usuario.id;
      req.setorId = usuario.setorId;

      return next();
    } catch (error) {
      console.error('Erro na autenticação:', error);
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
  }
}

export default new AuthMiddleware();