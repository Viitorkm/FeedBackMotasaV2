import Sequelize from "sequelize";
import databaseConfig from "../config/database.cjs";
import FeedbackModel from "../models/feedbacks.js";

const models = [FeedbackModel];

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