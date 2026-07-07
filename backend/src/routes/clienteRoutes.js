const { Router } = require('express');

const clienteController = require('../controllers/clienteController');

const auth = require('../middlewares/auth');
const authAtendente = require('../middlewares/authAtendente'); // Antigo authRecepcionista

const routes = new Router();

// Apenas atendentes/admin criam, atualizam ou deletam clientes manualmente, 
// mas todos os autenticados podem listar ou buscar.
routes.post('/clientes', auth, authAtendente, clienteController.create);
routes.get('/clientes', auth, clienteController.list);
routes.get('/clientes/buscar', auth, clienteController.select);
routes.put('/clientes', auth, authAtendente, clienteController.update);
routes.delete('/clientes', auth, authAtendente, clienteController.delete);

module.exports = routes;