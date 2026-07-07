const { Router } = require('express');
const AtendenteController = require('../controllers/AtendenteController/atendenteController.js');
const auth = require('../middlewares/auth');
const authRecep = require('../middlewares/authGerente');

const routes = new Router();

routes.post('/atendentes', auth, authRecep, AtendenteController.create);
routes.get('/atendentes', auth, authRecep, AtendenteController.list);
routes.get('/atendentes/buscar', auth, authRecep, AtendenteController.select);
routes.put('/atendentes', auth, authRecep, AtendenteController.update);
routes.delete('/atendentes', auth, authRecep, AtendenteController.delete);

module.exports = routes;