const express = require('express');
const cors = require('cors');

// Importação das rotas da Barbearia
const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes'); // Antigo pacienteRoutes
const barbeiroRoutes = require('./routes/barbeiroRoutes'); // Antigo medicoRoutes
const atendenteRoutes = require('./routes/atendenteRoutes'); // Antigo recepcionistaRoutes
const agendamentoRoutes = require('./routes/agendamentoRoutes');
const vendaProdutoRoutes = require('./routes/vendaProdutoRoutes'); // Antigo dispensaRoutes

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors({
      origin: 'http://localhost:5173', // URL padrão do Vite/React
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
  }

  routes() {
    // Endpoints disponíveis na API
    this.server.use(authRoutes);
    this.server.use(clienteRoutes);
    this.server.use(barbeiroRoutes);
    this.server.use(atendenteRoutes);
    this.server.use(agendamentoRoutes);
    this.server.use(vendaProdutoRoutes);
  }
}

// Exporta o servidor express pronto
module.exports = new App().server;