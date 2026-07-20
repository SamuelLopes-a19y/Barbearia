const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const barbeiroRoutes = require('./routes/barbeiroRoutes'); 
const atendenteRoutes = require('./routes/atendenteRoutes'); 
const agendamentoRoutes = require('./routes/agendamentoRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const vendaProdutoRoutes = require('./routes/vendaProdutoRoutes'); 

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors({
    origin: [
      'http://localhost:5173', 
      'http://127.0.0.1:5173',
      'http://localhost:5174', 
      'http://127.0.0.1:5174'
    ], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
  }

  routes() {

    this.server.use(authRoutes);
    this.server.use(clienteRoutes);
    this.server.use(barbeiroRoutes);
    this.server.use(atendenteRoutes);
    this.server.use(agendamentoRoutes);
    this.server.use(produtoRoutes);
    this.server.use(vendaProdutoRoutes);
    
  }
}

module.exports = new App().server;