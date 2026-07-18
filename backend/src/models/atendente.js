const Usuario = require("./usuario");
const Endereco = require('../models/EnderecoModel');

class Atendente extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, telefone) {
        super(nome, cpf, 'ATENDENTE', email, senha, dataNasc, endereco, telefone);
    }

    static validarAtendente(dados) {
        return Usuario.validarDadosUser(dados);
    }
}

module.exports = Atendente;