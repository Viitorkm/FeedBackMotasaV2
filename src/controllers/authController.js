import jwt from 'jsonwebtoken';
import database from '../database/index.js';

class AuthController {
  // Login do usuário
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
      }

      // Verificar se o banco está conectado
      if (!database.connection?.models?.Usuario) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      // Buscar usuário com setor
      const usuario = await database.connection.models.Usuario.findOne({
        where: {
          email: email.toLowerCase(),
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
          message: 'Credenciais inválidas'
        });
      }

      // Verificar senha
      const senhaValida = await usuario.checkPassword(senha);

      if (!senhaValida) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Gerar token JWT
      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          setorId: usuario.setorId
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        }
      );

      // Remover senha da resposta
      const { senha: _, ...usuarioSemSenha } = usuario.toJSON();

      return res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          usuario: usuarioSemSenha,
          token
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // Registro de usuário
  async register(req, res) {
    try {
      const { nome, email, senha, setorId } = req.body;

      if (!nome || !email || !senha || !setorId) {
        return res.status(400).json({
          success: false,
          message: 'Nome, email, senha e setor são obrigatórios'
        });
      }

      // Verificar se o banco está conectado
      if (!database.connection?.models?.Usuario) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      // Verificar se o setor existe e está ativo
      const setor = await database.connection.models.Setor.findOne({
        where: {
          id: setorId,
          ativo: true
        }
      });

      if (!setor) {
        return res.status(400).json({
          success: false,
          message: 'Setor inválido ou inativo'
        });
      }

      // Verificar se o email já existe
      const usuarioExistente = await database.connection.models.Usuario.findOne({
        where: { email: email.toLowerCase() }
      });

      if (usuarioExistente) {
        return res.status(400).json({
          success: false,
          message: 'Email já está em uso'
        });
      }

      // Criar usuário
      const usuario = await database.connection.models.Usuario.create({
        nome,
        email: email.toLowerCase(),
        senha,
        setorId
      });

      // Buscar usuário criado com setor
      const usuarioCompleto = await database.connection.models.Usuario.findByPk(usuario.id, {
        include: {
          model: database.connection.models.Setor,
          as: 'setor'
        }
      });

      // Gerar token JWT
      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          setorId: usuario.setorId
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        }
      );

      // Remover senha da resposta
      const { senha: _, ...usuarioSemSenha } = usuarioCompleto.toJSON();

      return res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: {
          usuario: usuarioSemSenha,
          token
        }
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // Verificar token
  async me(req, res) {
    try {
      // O usuário já foi carregado pelo middleware de autenticação
      const { senha: _, ...usuarioSemSenha } = req.usuario.toJSON();

      return res.json({
        success: true,
        message: 'Dados do usuário',
        data: {
          usuario: usuarioSemSenha
        }
      });
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }
}

export default new AuthController();