const Agendamento = require('../models/agendamento')

const { ObjectId } = require('mongodb');

module.exports = {
    async create(req, res) {
        try {
            const db = require('../database').getDb();
            const novoAgendamento = new Agendamento(req.body.data, req.body.descricao, req.body.status, req.body.horario, req.body.horarioFim, req.body.id_atendente, req.body.id_barbeiro, req.body.id_cliente);
            const resultado = await db.collection('agendamentos').insertOne(novoAgendamento);
            res.status(201).json(resultado);
        } catch (error) {
            console.log(error)
            res.status(500).json({ erro: error.message });
        }
    },
    async list(req, res) {
        try {
            const db = require('../database').getDb();
            const agendamentos = await db.collection('agendamentos').find().toArray();
            res.json(agendamentos);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },
    async select(req, res) {
        try {
            const { id } = req.query;
            const db = require('../database').getDb();
            const agendamento = await db.collection('agendamentos').findOne({ _id: new ObjectId(id) });
            res.json(agendamento);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },
    async update(req, res) {
        try {
            const id  = req.body.id_agend;
            const db = require('../database').getDb();
            const novoAgendamento = new Agendamento(req.body.data, req.body.descricao, req.body.status, req.body.horario, req.body.horarioFim, req.body.id_atendente, req.body.id_barbeiro, req.body.id_cliente);
            await db.collection('agendamentos').updateOne({ _id: new ObjectId(id) }, { $set: novoAgendamento });
            res.json({ mensagem: "Atualizado" });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.body;
            const db = require('../database').getDb();
            await db.collection('agendamentos').deleteOne({ _id: new ObjectId(id) });
            res.json({ mensagem: "Deletado" });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
};
