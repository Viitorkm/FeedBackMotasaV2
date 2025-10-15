import database from '../database/index.js';

class SetoresController {
  // Listar todos os setores ativos
  async index(req, res) {
    try {
      // Verificar se o banco está conectado
      if (!database.connection?.models?.Setor) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      const setores = await database.connection.models.Setor.findAll({
        where: { ativo: true },
        order: [['nome', 'ASC']]
      });

      return res.json({
        success: true,
        message: 'Lista de setores',
        data: setores,
        total: setores.length
      });
    } catch (error) {
      console.error('Erro ao buscar setores:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar setores',
        error: error.message
      });
    }
  }

  // Buscar setor por ID
  async show(req, res) {
    try {
      const { id } = req.params;

      if (!database.connection?.models?.Setor) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      const setor = await database.connection.models.Setor.findByPk(id);

      if (!setor) {
        return res.status(404).json({
          success: false,
          message: 'Setor não encontrado'
        });
      }

      return res.json({
        success: true,
        message: 'Dados do setor',
        data: setor
      });
    } catch (error) {
      console.error('Erro ao buscar setor:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar setor',
        error: error.message
      });
    }
  }

  // Criar novo setor
  async store(req, res) {
    try {
      const { nome, descricao } = req.body;

      if (!nome) {
        return res.status(400).json({
          success: false,
          message: 'Nome do setor é obrigatório'
        });
      }

      if (!database.connection?.models?.Setor) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      const setor = await database.connection.models.Setor.create({
        nome,
        descricao
      });

      return res.status(201).json({
        success: true,
        message: 'Setor criado com sucesso',
        data: setor
      });
    } catch (error) {
      console.error('Erro ao criar setor:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Já existe um setor com este nome'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro ao criar setor',
        error: error.message
      });
    }
  }

  // Atualizar setor
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, ativo } = req.body;

      if (!database.connection?.models?.Setor) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      const setor = await database.connection.models.Setor.findByPk(id);

      if (!setor) {
        return res.status(404).json({
          success: false,
          message: 'Setor não encontrado'
        });
      }

      await setor.update({
        nome: nome || setor.nome,
        descricao: descricao !== undefined ? descricao : setor.descricao,
        ativo: ativo !== undefined ? ativo : setor.ativo
      });

      return res.json({
        success: true,
        message: 'Setor atualizado com sucesso',
        data: setor
      });
    } catch (error) {
      console.error('Erro ao atualizar setor:', error);

      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Já existe um setor com este nome'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar setor',
        error: error.message
      });
    }
  }

  // Deletar setor (soft delete)
  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!database.connection?.models?.Setor) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      const setor = await database.connection.models.Setor.findByPk(id);

      if (!setor) {
        return res.status(404).json({
          success: false,
          message: 'Setor não encontrado'
        });
      }

      // Verificar se existem usuários vinculados ao setor
      const usuariosVinculados = await database.connection.models.Usuario.count({
        where: {
          setorId: id,
          ativo: true
        }
      });

      if (usuariosVinculados > 0) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível excluir setor com usuários vinculados'
        });
      }

      await setor.update({ ativo: false });

      return res.json({
        success: true,
        message: 'Setor inativado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar setor:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao deletar setor',
        error: error.message
      });
    }
  }
}

export default new SetoresController();