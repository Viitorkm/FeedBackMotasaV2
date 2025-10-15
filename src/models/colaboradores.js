import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Colaborador = sequelize.define('Colaborador', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numeroidentificacao: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Número de identificação é obrigatório'
        },
        len: {
          args: [1, 50],
          msg: 'Número de identificação deve ter entre 1 e 50 caracteres'
        }
      }
    },
    nomecompleto: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nome completo é obrigatório'
        },
        len: {
          args: [1, 255],
          msg: 'Nome completo deve ter entre 1 e 255 caracteres'
        }
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Email é obrigatório'
        },
        isEmail: {
          msg: 'Email deve ter um formato válido'
        },
        len: {
          args: [1, 100],
          msg: 'Email deve ter entre 1 e 100 caracteres'
        }
      }
    }
  }, {
    tableName: 'colaboradores',
    timestamps: false,
    underscored: false
  });

  return Colaborador;
};