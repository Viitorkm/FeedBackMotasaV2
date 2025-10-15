import database from '../database/index.js';

class ColaboradoresController {

  // Listar todos os colaboradores
  async index(req, res) {
    try {
      // Verificar se o banco está conectado
      if (!database.connection?.models?.Colaborador) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      const colaboradores = await database.connection.models.Colaborador.findAll({
        order: [['nomecompleto', 'ASC']]
      });

      return res.json({
        success: true,
        message: 'Lista de colaboradores',
        data: colaboradores,
        total: colaboradores.length
      });
    } catch (error) {
      console.error('Erro ao buscar colaboradores:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar colaboradores',
        error: error.message
      });
    }
  }

  // Buscar colaborador por ID
  async show(req, res) {
    try {
      const { id } = req.params;

      if (!database.connection?.models?.Colaborador) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      const colaborador = await database.connection.models.Colaborador.findByPk(id);

      if (!colaborador) {
        return res.status(404).json({
          success: false,
          message: 'Colaborador não encontrado'
        });
      }

      return res.json({
        success: true,
        message: 'Colaborador encontrado',
        data: colaborador
      });
    } catch (error) {
      console.error('Erro ao buscar colaborador:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar colaborador',
        error: error.message
      });
    }
  }

  // Criar novo colaborador
  async store(req, res) {
    try {
      // Verificar se req.body existe
      if (!req.body) {
        return res.status(400).json({
          success: false,
          message: 'Dados não enviados no corpo da requisição'
        });
      }

      const { numeroidentificacao, nomecompleto, email } = req.body;

      // Validação básica
      if (!numeroidentificacao) {
        return res.status(400).json({
          success: false,
          message: 'Número de identificação é obrigatório'
        });
      }

      if (!nomecompleto) {
        return res.status(400).json({
          success: false,
          message: 'Nome completo é obrigatório'
        });
      }

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email é obrigatório'
        });
      }

      // Verificar se o banco está conectado
      if (!database.connection?.models?.Colaborador) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      // Salvar no banco de dados
      const colaborador = await database.connection.models.Colaborador.create({
        numeroidentificacao,
        nomecompleto,
        email
      });

      return res.status(201).json({
        success: true,
        message: 'Colaborador criado com sucesso',
        data: colaborador
      });
    } catch (error) {
      console.error('Erro ao criar colaborador:', error);
      
      // Verificar se é erro de duplicidade
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Email ou número de identificação já existe',
          error: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro ao criar colaborador',
        error: error.message
      });
    }
  }

  // Atualizar colaborador
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nomecompleto, email } = req.body;

      if (!database.connection?.models?.Colaborador) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      // Validação básica
      if (nomecompleto && (nomecompleto.length < 1 || nomecompleto.length > 255)) {
        return res.status(400).json({
          success: false,
          message: 'Nome completo deve ter entre 1 e 255 caracteres'
        });
      }

      if (email && (email.length < 1 || email.length > 100)) {
        return res.status(400).json({
          success: false,
          message: 'Email deve ter entre 1 e 100 caracteres'
        });
      }

      const colaborador = await database.connection.models.Colaborador.findByPk(id);

      if (!colaborador) {
        return res.status(404).json({
          success: false,
          message: 'Colaborador não encontrado'
        });
      }

      // Atualizar apenas os campos enviados
      const updateData = {};
      if (nomecompleto !== undefined) updateData.nomecompleto = nomecompleto;
      if (email !== undefined) updateData.email = email;

      await colaborador.update(updateData);

      return res.json({
        success: true,
        message: 'Colaborador atualizado com sucesso',
        data: colaborador
      });
    } catch (error) {
      console.error('Erro ao atualizar colaborador:', error);
      
      // Verificar se é erro de duplicidade
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Email já existe',
          error: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar colaborador',
        error: error.message
      });
    }
  }

  // Deletar colaborador
  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!database.connection?.models?.Colaborador) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      const colaborador = await database.connection.models.Colaborador.findByPk(id);

      if (!colaborador) {
        return res.status(404).json({
          success: false,
          message: 'Colaborador não encontrado'
        });
      }

      await colaborador.destroy();

      return res.json({
        success: true,
        message: 'Colaborador deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar colaborador:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao deletar colaborador',
        error: error.message
      });
    }
  }

  // Estatísticas
  async stats(req, res) {
    try {
      if (!database.connection?.models?.Colaborador) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      const total = await database.connection.models.Colaborador.count();

      return res.json({
        success: true,
        data: { 
          total,
          message: `Total de ${total} colaboradores cadastrados`
        }
      });
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao calcular estatísticas',
        error: error.message
      });
    }
  }
}

export default new ColaboradoresController();