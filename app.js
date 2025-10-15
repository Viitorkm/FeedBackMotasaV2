import 'dotenv/config';
import express from "express";

import feedbacksRoutes from "./src/routes/feedbacksRoutes.js";
import colaboradoresRoutes from "./src/routes/colaboradoresRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import setoresRoutes from "./src/routes/setoresRoutes.js";

import "./src/database/index.js";

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    
    // Middleware de debug para requisições POST
    this.server.use((req, res, next) => {
      if (req.method === 'POST') {
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Body:', req.body);
      }
      next();
    });
  }

  routes() {
    this.server.use('/api/auth', authRoutes);
    this.server.use('/api/setores', setoresRoutes);
    this.server.use('/api/feedbacks', feedbacksRoutes);
    this.server.use('/api/colaboradores', colaboradoresRoutes);
    this.server.use('/api/dashboard', dashboardRoutes);
  }
}

export default new App().server;