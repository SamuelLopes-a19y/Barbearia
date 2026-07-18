const bcryptjs = require('bcryptjs');

const Atendente = require('../models/atendente');
const Endereco = require('../models/EnderecoModel');
const AtendenteRepo = require('../repositories/atendenteRepository');

module.exports = {
    async create(req, res) {
        try {
            const dados = req.body;
            const erros = [];

            const errosAtendente = Atendente.validarAtendente(dados);
            if (errosAtendente.length > 0) erros.push(...errosAtendente);
            
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const { nome, cpf, email, senha, dataNasc, endereco, telefone, turno } = dados;

            const atendente = new Atendente(nome, cpf, email, senha, dataNasc, endereco, telefone, turno);

            await atendente.hashPassword();
            const resultado = await AtendenteRepo.create(atendente);

            res.status(201).json({
                mensagem: "Atendente cadastrado com sucesso!",
                id_atendente: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async list(req, res) {
        try {
            const atendentes = await AtendenteRepo.findAll();
            res.json(atendentes);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async select(req, res) {
        try {
            const id = req.query.id || req.body.id;

            if (!id) {
                return res.status(400).json({ erro: "ID não fornecido." });
            }

            const atendente = await AtendenteRepo.findById(id);

            if (!atendente) {
                return res.status(404).json({ erro: "Atendente não encontrado." });
            }

            res.status(200).json(atendente);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async update(req, res) {
        try {
            const dados = req.body;
            const id = dados.id || dados._id;

            if (!id) {
                return res.status(400).json({ erro: "ID obrigatório." });
            }

            if (dados.senha) {
                dados.senha = await bcryptjs.hash(dados.senha, 10);
            }

            const resultado = await AtendenteRepo.update(id, dados);

            if (resultado.matchedCount === 0 || !resultado) {
                return res.status(404).json({ erro: "Atendente não encontrado." });
            }

            res.status(200).json({ mensagem: "Atendente atualizado com sucesso!" });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async delete(req, res) {
        try {
            const id = req.body.id || req.query.id;

            if (!id) {
                return res.status(400).json({ erro: "ID obrigatório." });
            }

            const resultado = await AtendenteRepo.delete(id);

            if (resultado.deletedCount === 0 || !resultado) {
                return res.status(404).json({ erro: "Atendente não encontrado." });
            }

            res.status(200).json({ mensagem: "Atendente excluído com sucesso!" });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
};