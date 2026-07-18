const { ObjectId } = require('mongodb');
const BarbeiroRepo = require('../repositories/barbeiroRepository');

module.exports = {
    async list(req, res) {
        try {
            const db = require('../database').getDb();
            // Filtra pela agenda do barbeiro logado
            const agendamentos = await db.collection('agendamentos').find({ id_barbeiro: req.userId }).toArray();
            res.json(agendamentos);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },
    async select(req, res) {
        try {
            const { id } = req.query;
            const db = require('../database').getDb();
            const agendamento = await db.collection('agendamentos').findOne({ _id: new ObjectId(id), id_barbeiro: req.userId });
            res.json(agendamento);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },
    async update(req, res) {
        try {
            const { id, status } = req.body;
            const db = require('../database').getDb();
            await db.collection('agendamentos').updateOne(
                { _id: new ObjectId(id), id_barbeiro: req.userId }, 
                { $set: { status } }
            );
            res.json({ mensagem: "Status atualizado" });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
};
