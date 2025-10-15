import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Setor = sequelize.define('Setor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Nome do setor é obrigatório'
        },
        len: {
          args: [1, 100],
          msg: 'Nome do setor deve ter entre 1 e 100 caracteres'
        }
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    tableName: 'setores',
    timestamps: true,
    underscored: true
  });

  return Setor;
};