const express = require('express');

const clienteRoutes = require('./routes/clienteRoutes');
const barbeiroRoutes = require('./routes/barbeiroRoutes');
const atendenteRoutes = require('./routes/atendenteRoutes');
const gerenteRoutes = require('./routes/gerenteRoutes');
// const agendamentoRoutes =  require('./routes/agendamentoRoutes');
// const authRoutes = require('./routes/authRoutes');
// const avaliacaoRoutes =  require('./routes/avaliacaoRoutes');
// const historicoCorteRoutes = require('./routes/historicoCorteRoutes');
// const recomendacaoRoutes = require('./routes/recomendacaoRoutes');
// const pedidoEspecialRoutes = require('./routes/pedidoEspecialRoutes');
// const produtoRoutes = require('./routes/produtoRoutes');
// const vendaRoutes = require('./routes/vendaRoutes');
// const cors = require('cors');


class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors({
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
  }
  

  routes() {
    this.server.use(clienteRoutes);
    this.server.use(barbeiroRoutes);
    this.server.use(atendenteRoutes);
    this.server.use(gerenteRoutes);
    this.server.use(agendamentoRoutes);
    this.server.use(authRoutes);
    this.server.use(avaliacaoRoutes);
    this.server.use(historicoCorteRoutes);
    this.server.use(recomendacaoRoutes);
    this.server.use(pedidoEspecialRoutes);
    this.server.use(produtoRoutes);
    this.server.use(vendaRoutes);
  }
}

module.exports = new App().server;