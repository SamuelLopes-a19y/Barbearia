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

if (dados.endereco) {
                const errosEnd = Endereco.validarEndereco(dados.endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }

            // Validação de e-mail/cpf existente removida para brevidade, mas é igual à de cima.
            
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
    }
};