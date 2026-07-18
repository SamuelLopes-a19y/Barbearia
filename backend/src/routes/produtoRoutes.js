const { Router } = require('express');

const ProdutoController = require('../controllers/produtoController');

const auth = require('../middlewares/auth');
const authAtendente = require('../middlewares/authAtendente'); 

const routes = new Router();

routes.post('/produtos', auth, authAtendente, ProdutoController.create);
routes.put('/produtos', auth, authAtendente, ProdutoController.update);
routes.delete('/produtos', auth, authAtendente, ProdutoController.delete);
routes.get('/produtos', auth, authAtendente, ProdutoController.list);
routes.get('/produtos/buscar', auth, authAtendente, ProdutoController.select);
routes.post('/produtos/vender', auth, authAtendente, ProdutoController.realizarVenda);

module.exports = routes;