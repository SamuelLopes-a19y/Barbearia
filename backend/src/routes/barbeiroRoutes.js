const { Router } = require('express');
const BarbeiroController = require('../controllers/barbeiroController');
const auth = require('../middlewares/auth');
const authAtendente = require('../middlewares/authAtendente');

const routes = new Router();

routes.post('/barbeiros', auth, authAtendente, BarbeiroController.create);
routes.get('/barbeiros', auth, BarbeiroController.list);
routes.get('/barbeiros/buscar', auth, BarbeiroController.select);
routes.put('/barbeiros', auth, authAtendente, BarbeiroController.update);
routes.delete('/barbeiros', auth, authAtendente, BarbeiroController.delete);

module.exports = routes;