import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Feedback = sequelize.define('Feedback', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    NomeAvaliador: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nome do avaliador é obrigatório'
        },
        len: {
          args: [1, 100],
          msg: 'Nome do avaliador deve ter entre 1 e 100 caracteres'
        }
      }
    },
    Estrelas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: 'Avaliação deve ser de no mínimo 1 estrela'
        },
        max: {
          args: 5,
          msg: 'Avaliação deve ser de no máximo 5 estrelas'
        }
      }
    },
    Mensagem: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    setorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'setor_id',
      references: {
        model: 'setores',
        key: 'id'
      }
    },
    colaboradorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'colaborador_id',
      references: {
        model: 'colaboradores',
        key: 'id'
      }
    }
  }, {
    tableName: 'feedbacks',
    timestamps: true,
    underscored: false
  });

  // Associações
  Feedback.associate = (models) => {
    Feedback.belongsTo(models.Setor, {
      foreignKey: 'setorId',
      as: 'setor'
    });
    
    Feedback.belongsTo(models.Colaborador, {
      foreignKey: 'colaboradorId',
      as: 'colaborador'
    });
  };

  return Feedback;
};
