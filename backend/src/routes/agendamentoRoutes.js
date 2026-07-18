const { Router } = require('express');
const atendenteAgendController = require('../controllers/AtendenteAgendamentoController');
const barbeiroAgendController = require('../controllers/barbeiroAgendamentoController');
const auth = require('../middlewares/auth');
const authAtendente = require('../middlewares/authAtendente');
const authBarbeiro = require('../middlewares/authBarbeiro'); 

const routes = new Router();

// Rotas do Atendente
routes.post('/agendamento/atendente', auth, authAtendente, atendenteAgendController.create);
routes.get('/agendamento/atendente', auth, authAtendente, atendenteAgendController.list);
routes.get('/agendamento/atendente/buscar', auth, authAtendente, atendenteAgendController.select);
routes.put('/agendamento/atendente', auth, authAtendente, atendenteAgendController.update);
routes.delete('/agendamento/atendente', auth, authAtendente, atendenteAgendController.delete);

// Rotas do Barbeiro 
routes.get('/agendamento/barbeiro', auth, authBarbeiro, barbeiroAgendController.list);
routes.get('/agendamento/barbeiro/buscar', auth, authBarbeiro, barbeiroAgendController.select);
routes.put('/agendamento/barbeiro', auth, authBarbeiro, barbeiroAgendController.update);

module.exports = routes;