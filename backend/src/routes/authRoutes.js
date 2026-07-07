const { Router } = require('express');
const authController = require('../controllers/authController');

const routes = new Router();

// Rota de login único (Cliente, Barbeiro, Atendente, Admin)
routes.post('/login', authController.login);

module.exports = routes;