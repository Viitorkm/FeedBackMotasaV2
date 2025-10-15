import database from '../database/index.js';

class DashboardController {
  // Endpoint principal do dashboard
  async index(req, res) {
    try {
      // TODO: Implementar lógica do dashboard
      // O usuário autenticado está disponível em req.usuario
      const { usuario } = req;
      
      return res.json({
        success: true,
        message: 'Dashboard endpoint',
        data: {
          message: 'Dashboard em desenvolvimento',
          usuario: {
            id: usuario.id,
            nome: usuario.nome,
            setor: usuario.setor.nome
          }
        }
      });
    } catch (error) {
      console.error('Erro no dashboard:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // Contar colaboradores por setor
  async contarColaboradoresSetor(req, res) {
    try {
      // Extrair o setorId do usuário autenticado
      const { usuario } = req;
      const setorId = usuario.setorId;

      // Verificar se o banco está conectado
      if (!database.connection?.models?.Usuario || !database.connection?.models?.Setor) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      // Contar colaboradores ativos no setor do usuário logado
      const totalColaboradores = await database.connection.models.Usuario.count({
        where: {
          setorId: setorId,
          ativo: true
        }
      });

      return res.json({
        success: true,
        message: 'Contagem de colaboradores do seu setor',
        data: {
          quantidadeColaboradoresSetor: totalColaboradores
        }
      });
    } catch (error) {
      console.error('Erro ao contar colaboradores:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // Contar feedbacks do setor
  async contarFeedbacksSetor(req, res) {
    try {
      // Extrair o setorId do usuário autenticado
      const { usuario } = req;
      const setorId = usuario.setorId;

      // Verificar se o banco está conectado
      if (!database.connection?.models?.Feedback) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      // Contar feedbacks do setor do usuário logado
      const totalFeedbacks = await database.connection.models.Feedback.count({
        where: {
          setorId: setorId
        }
      });

      return res.json({
        success: true,
        message: 'Contagem de feedbacks do seu setor',
        data: {
          quantidadeFeedbacksSetor: totalFeedbacks
        }
      });
    } catch (error) {
      console.error('Erro ao contar feedbacks:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // Contar avaliações do setor
  async contarAvaliacoesSetor(req, res) {
    try {
      // Extrair o setorId do usuário autenticado
      const { usuario } = req;
      const setorId = usuario.setorId;

      // Verificar se o banco está conectado
      if (!database.connection?.models?.Feedback) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      // Contar avaliações do setor do usuário logado
      const totalAvaliacoes = await database.connection.models.Feedback.count({
        where: {
          setorId: setorId
        }
      });

      return res.json({
        success: true,
        message: 'Contagem de avaliações do seu setor',
        data: {
          quantidadeAvaliacoesSetor: totalAvaliacoes
        }
      });
    } catch (error) {
      console.error('Erro ao contar avaliações:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // Calcular média de desempenho do setor
  async mediaDesempenhoSetor(req, res) {
    try {
      // Extrair o setorId do usuário autenticado
      const { usuario } = req;
      const setorId = usuario.setorId;

      // Verificar se o banco está conectado
      if (!database.connection?.models?.Feedback) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      // Buscar todas as avaliações do setor para calcular a média
      const avaliacoes = await database.connection.models.Feedback.findAll({
        where: {
          setorId: setorId
        },
        attributes: ['Estrelas']
      });

      // Verificar se existem avaliações
      if (avaliacoes.length === 0) {
        return res.json({
          success: true,
          message: 'Média de desempenho do setor',
          data: {
            mediaDesempenhoSetor: 0
          }
        });
      }

      // Calcular a média
      const somaEstrelas = avaliacoes.reduce((soma, avaliacao) => soma + avaliacao.Estrelas, 0);
      const media = somaEstrelas / avaliacoes.length;

      return res.json({
        success: true,
        message: 'Média de desempenho do setor',
        data: {
          mediaDesempenhoSetor: parseFloat(media.toFixed(2))
        }
      });
    } catch (error) {
      console.error('Erro ao calcular média de desempenho:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // Calcular média de desempenho do setor no mês atual
  async mediaDesempenhoSetorMes(req, res) {
    try {
      // Extrair o setorId do usuário autenticado
      const { usuario } = req;
      const setorId = usuario.setorId;

      // Verificar se o banco está conectado
      if (!database.connection?.models?.Feedback) {
        return res.status(500).json({
          success: false,
          message: 'Erro na conexão com o banco de dados'
        });
      }

      // Obter o primeiro e último dia do mês atual
      const agora = new Date();
      const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
      const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59, 999);

      // Buscar todas as avaliações do setor do mês atual
      const avaliacoes = await database.connection.models.Feedback.findAll({
        where: {
          setorId: setorId,
          createdAt: {
            [database.connection.Sequelize.Op.between]: [inicioMes, fimMes]
          }
        },
        attributes: ['Estrelas', 'createdAt']
      });

      // Verificar se existem avaliações no mês
      if (avaliacoes.length === 0) {
        return res.json({
          success: true,
          message: 'Média de desempenho do setor no mês',
          data: {
            mediaDesempenhoSetorMes: 0
          }
        });
      }

      // Calcular a média
      const somaEstrelas = avaliacoes.reduce((soma, avaliacao) => soma + avaliacao.Estrelas, 0);
      const media = somaEstrelas / avaliacoes.length;

      return res.json({
        success: true,
        message: 'Média de desempenho do setor no mês',
        data: {
          mediaDesempenhoSetorMes: parseFloat(media.toFixed(2))
        }
      });
    } catch (error) {
      console.error('Erro ao calcular média de desempenho do mês:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }
}

export default new DashboardController();