const bcryptjs = require('bcryptjs');

const Atendente = require('../../models/atendente');
const AtendenteRepo = require('../../repositories/atendenteRepository');

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
    }
};