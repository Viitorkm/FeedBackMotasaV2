import database from '../database/index.js';

class FeedbacksController {
  // Listar todos os feedbacks
  async index(req, res) {
    try {
      // Verificar se o banco está conectado
      if (!database.connection?.models?.Feedback) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      const feedbacks = await database.connection.models.Feedback.findAll({
        order: [['createdAt', 'DESC']]
      });

      return res.json({
        success: true,
        message: 'Lista de feedbacks',
        data: feedbacks,
        total: feedbacks.length
      });
    } catch (error) {
      console.error('Erro ao buscar feedbacks:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar feedbacks',
        error: error.message
      });
    }
  }

  // Buscar feedback por ID
  async show(req, res) {
    try {
      const { id } = req.params;

      if (!database.connection?.models?.Feedback) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      const feedback = await database.connection.models.Feedback.findByPk(id);

      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: 'Feedback não encontrado'
        });
      }

      return res.json({
        success: true,
        message: 'Feedback encontrado',
        data: feedback
      });
    } catch (error) {
      console.error('Erro ao buscar feedback:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar feedback',
        error: error.message
      });
    }
  }

  // Criar novo feedback
  async store(req, res) {
    try {
      // Verificar se req.body existe
      if (!req.body) {
        return res.status(400).json({
          success: false,
          message: 'Dados não enviados no corpo da requisição'
        });
      }

      const { NomeAvaliador, Estrelas, Mensagem, setorId, colaboradorId } = req.body;

      // Validação básica
      if (!NomeAvaliador) {
        return res.status(400).json({
          success: false,
          message: 'Nome do avaliador é obrigatório'
        });
      }

      if (!Estrelas || Estrelas < 1 || Estrelas > 5) {
        return res.status(400).json({
          success: false,
          message: 'Avaliação deve ser entre 1 e 5 estrelas'
        });
      }

      // Verificar se o banco está conectado
      if (!database.connection.models.Feedback) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      // Salvar no banco de dados
      const feedback = await database.connection.models.Feedback.create({
        NomeAvaliador,
        Estrelas,
        Mensagem: Mensagem || null,
        setorId: setorId || null,
        colaboradorId: colaboradorId || null
      });

      return res.status(201).json({
        success: true,
        message: 'Feedback criado com sucesso',
        data: feedback
      });
    } catch (error) {
      console.error('Erro ao criar feedback:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar feedback',
        error: error.message
      });
    }
  }

  // Atualizar feedback
  async update(req, res) {
    try {
      const { id } = req.params;
      const { NomeAvaliador, Estrelas, Mensagem, setorId, colaboradorId } = req.body;

      if (!database.connection.models.Feedback) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      // Validação básica
      if (NomeAvaliador && (NomeAvaliador.length < 1 || NomeAvaliador.length > 100)) {
        return res.status(400).json({
          success: false,
          message: 'Nome do avaliador deve ter entre 1 e 100 caracteres'
        });
      }

      if (Estrelas && (Estrelas < 1 || Estrelas > 5)) {
        return res.status(400).json({
          success: false,
          message: 'Avaliação deve ser entre 1 e 5 estrelas'
        });
      }

      const feedback = await database.connection.models.Feedback.findByPk(id);

      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: 'Feedback não encontrado'
        });
      }

      // Atualizar apenas os campos enviados
      const updateData = {};
      if (NomeAvaliador !== undefined) updateData.NomeAvaliador = NomeAvaliador;
      if (Estrelas !== undefined) updateData.Estrelas = Estrelas;
      if (Mensagem !== undefined) updateData.Mensagem = Mensagem;
      if (setorId !== undefined) updateData.setorId = setorId;
      if (colaboradorId !== undefined) updateData.colaboradorId = colaboradorId;

      await feedback.update(updateData);

      return res.json({
        success: true,
        message: 'Feedback atualizado com sucesso',
        data: feedback
      });
    } catch (error) {
      console.error('Erro ao atualizar feedback:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar feedback',
        error: error.message
      });
    }
  }

  // Deletar feedback
  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!database.connection.models.Feedback) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      const feedback = await database.connection.models.Feedback.findByPk(id);

      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: 'Feedback não encontrado'
        });
      }

      await feedback.destroy();

      return res.json({
        success: true,
        message: 'Feedback deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar feedback:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao deletar feedback',
        error: error.message
      });
    }
  }

  // Estatísticas
  async stats(req, res) {
    try {
      if (!database.connection.models.Feedback) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      const total = await database.connection.models.Feedback.count();
      
      if (total === 0) {
        return res.json({
          success: true,
          data: { 
            total: 0, 
            mediaEstrelas: '0.00',
            distribuicaoEstrelas: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
          }
        });
      }

      // Calcular média de estrelas
      const [result] = await database.connection.models.Feedback.findAll({
        attributes: [
          [database.connection.models.Feedback.sequelize.fn('AVG', database.connection.models.Feedback.sequelize.col('Estrelas')), 'media']
        ]
      });

      // Distribuição por estrelas
      const distribuicao = await database.connection.models.Feedback.findAll({
        attributes: [
          'Estrelas',
          [database.connection.models.Feedback.sequelize.fn('COUNT', database.connection.models.Feedback.sequelize.col('Estrelas')), 'count']
        ],
        group: ['Estrelas'],
        order: [['Estrelas', 'ASC']]
      });

      const distribuicaoEstrelas = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      distribuicao.forEach(item => {
        distribuicaoEstrelas[item.Estrelas] = parseInt(item.dataValues.count);
      });

      return res.json({
        success: true,
        data: { 
          total,
          mediaEstrelas: parseFloat(result.dataValues.media).toFixed(2),
          distribuicaoEstrelas
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

export default new FeedbacksController();
