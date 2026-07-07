const { Router } = require('express');
const ClienteController = require('../controllers/ClienteController/ClienteController');
const auth = require('../middlewares/auth');
const authRecep = require('../middlewares/authGerente');

const routes = new Router();

routes.post('/clientes', auth, authRecep, ClienteController.create);
routes.get('/clientes', auth, ClienteController.list);
routes.get('/clientes/buscar', auth, ClienteController.select);
routes.put('/clientes', auth, authRecep, ClienteController.update);
routes.delete('/clientes', auth, authRecep, ClienteController.delete);

module.exports = routes;