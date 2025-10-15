import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

export default (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nome é obrigatório'
        },
        len: {
          args: [1, 255],
          msg: 'Nome deve ter entre 1 e 255 caracteres'
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
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Senha é obrigatória'
        },
        len: {
          args: [6, 255],
          msg: 'Senha deve ter pelo menos 6 caracteres'
        }
      }
    },
    setorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'setor_id',
      references: {
        model: 'setores',
        key: 'id'
      },
      validate: {
        notEmpty: {
          msg: 'Setor é obrigatório'
        }
      }
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.senha) {
          usuario.senha = await bcrypt.hash(usuario.senha, 12);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('senha')) {
          usuario.senha = await bcrypt.hash(usuario.senha, 12);
        }
      }
    }
  });

  // Método para verificar senha
  Usuario.prototype.checkPassword = function(senha) {
    return bcrypt.compare(senha, this.senha);
  };

  // Associações
  Usuario.associate = (models) => {
    Usuario.belongsTo(models.Setor, {
      foreignKey: 'setorId',
      as: 'setor'
    });
  };

  return Usuario;
};