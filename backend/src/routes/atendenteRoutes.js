const { Router } = require('express');
const AtendenteController = require('../controllers/atendenteController');
const auth = require('../middlewares/auth');
const authAtendente = require('../middlewares/authAtendente');

const routes = new Router();


routes.post('/atendentes', auth, authAtendente, AtendenteController.create);
routes.get('/atendentes', auth, authAtendente, AtendenteController.list);
routes.get('/atendentes/buscar', auth, authAtendente, AtendenteController.select);
routes.put('/atendentes', auth, authAtendente, AtendenteController.update);
routes.delete('/atendentes', auth, authAtendente, AtendenteController.delete);

module.exports = routes;