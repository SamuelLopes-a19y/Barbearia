const { Router } = require('express');

const VendaProdutoController = require('../controllers/vendaProdutoController');

const auth = require('../middlewares/auth');
const authAtendente = require('../middlewares/authAtendente'); 

const routes = new Router();

routes.post('/produtos', auth, authAtendente, VendaProdutoController.create);
routes.put('/produtos', auth, authAtendente, VendaProdutoController.update);
routes.delete('/produtos', auth, authAtendente, VendaProdutoController.delete);
routes.get('/produtos', auth, authAtendente, VendaProdutoController.list);
routes.get('/produtos/buscar', auth, authAtendente, VendaProdutoController.select);

routes.post('/produtos/vender', auth, authAtendente, VendaProdutoController.realizarVenda);

module.exports = routes;