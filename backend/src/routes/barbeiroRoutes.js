const { Router } = require('express');
const BarbeiroController = require('../controllers/BarbeiroController/BarbeiroController');
const auth = require('../middlewares/auth');
const authRecep = require('../middlewares/authGerente');
const routes = new Router();

routes.post('/barbeiros', auth, authRecep, BarbeiroController.create);
routes.get('/barbeiros', auth, BarbeiroController.list);
routes.get('/barbeiros/buscar', auth, BarbeiroController.select);
routes.put('/barbeiros', auth, authRecep, BarbeiroController.update);
routes.delete('/barbeiros', auth, authRecep, BarbeiroController.delete);

module.exports = routes;