const { Router } = require('express');
const VendaProdutoController = require('../controllers/vendaProdutoController');
const auth = require('../middlewares/auth');
const authAtendente = require('../middlewares/authAtendente');

const routes = new Router();

routes.post('/vendas/produtos', auth, authAtendente, VendaProdutoController.create);
routes.get('/vendas/produtos', auth, authAtendente, VendaProdutoController.list);
routes.get('/vendas/produtos/buscar', auth, authAtendente, VendaProdutoController.select);

module.exports = routes;
