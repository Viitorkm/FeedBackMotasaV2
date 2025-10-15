import Sequelize from "sequelize";
import databaseConfig from "../config/database.cjs";
import FeedbackModel from "../models/feedbacks.js";
import ColaboradorModel from "../models/colaboradores.js";
import SetorModel from "../models/setores.js";
import UsuarioModel from "../models/usuarios.js";

const models = [FeedbackModel, ColaboradorModel, SetorModel, UsuarioModel];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    // Inicializar modelos
    models.forEach((modelDefiner) => {
      modelDefiner(this.connection, Sequelize.DataTypes);
    });

    // Associações (se houver)
    Object.values(this.connection.models).forEach((model) => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }
}

export default new Database();