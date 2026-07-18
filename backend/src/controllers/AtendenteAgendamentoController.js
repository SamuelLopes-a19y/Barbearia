const AgendamentoRepo = require('../repositories/baseRepository'); // Usando base para exemplo ou criar um específico
// Nota: O ideal seria um agendamentoRepository, mas vamos usar o base para a coleção agendamentos
const { ObjectId } = require('mongodb');

module.exports = {
    async create(req, res) {
        try {
            const db = require('../database').getDb();
            const resultado = await db.collection('agendamentos').insertOne(req.body);
            res.status(201).json(resultado);
        } catch (error) {
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
            const { id } = req.body;
            const db = require('../database').getDb();
            const { id: _, ...dados } = req.body;
            await db.collection('agendamentos').updateOne({ _id: new ObjectId(id) }, { $set: dados });
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
