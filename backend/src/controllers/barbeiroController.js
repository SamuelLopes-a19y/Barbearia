const bcryptjs = require('bcryptjs');
const Barbeiro = require('../models/barbeiro');
const Endereco = require('../models/EnderecoModel');
const BarbeiroRepo = require('../repositories/barbeiroRepository');

module.exports = {
    async create(req, res) {
        try {
            const dados = req.body;
            const erros = [];

            const errosBarbeiro = Barbeiro.validarBarbeiro(dados);
            if (errosBarbeiro.length > 0) erros.push(...errosBarbeiro);

            if (dados.endereco) {
const errosEnd = Endereco.validarEndereco(dados.endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }

            if (erros.length === 0) {
                const usuarioExistente = await BarbeiroRepo.findByCpfOrEmail(dados.cpf, dados.email);
                if (usuarioExistente) {
                    if (usuarioExistente.cpf === dados.cpf) erros.push("CPF já existe.");
                    if (usuarioExistente.email === dados.email) erros.push("E-mail já existe.");
                }
            }
            
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const { nome, cpf, email, senha, dataNasc, endereco, telefone, especialidades, descricao } = dados;

            const barbeiro = new Barbeiro(
                nome, cpf, email, senha, dataNasc, endereco, telefone, especialidades, descricao
            );  

            await barbeiro.hashPassword();

            const resultado = await BarbeiroRepo.create(barbeiro);

            res.status(201).json({
                mensagem: "Barbeiro cadastrado com sucesso!",
                id_barbeiro: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async list(req, res) {
        try {
            const barbeiros = await BarbeiroRepo.findAll();
            res.json(barbeiros);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async select(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({ erro: "ID não encontrado" });
            const barbeiro = await BarbeiroRepo.findById(id);
            if (!barbeiro) return res.status(404).json({ erro: "Barbeiro não encontrado" });
            res.status(200).json(barbeiro);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id, nome, cpf, email, senha, dataNasc, endereco, telefone, especialidades, descricao } = req.body;
            if (!id) return res.status(400).json({ erro: "ID obrigatório" });
            
            const dadosAtualizados = { nome, cpf, email, dataNasc, endereco, telefone, especialidades, descricao };
            if (senha) {
                dadosAtualizados.senha = await bcryptjs.hash(senha, 8);
            }

            await BarbeiroRepo.update(id, dadosAtualizados);
            res.status(200).json({ mensagem: "Barbeiro atualizado com sucesso!" });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({ erro: "ID não encontrado" });
            await BarbeiroRepo.delete(id);
            res.status(200).json({ mensagem: "Barbeiro deletado com sucesso!" });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
};