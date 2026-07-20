const Usuario = require("./usuario");
const Endereco = require('../models/EnderecoModel');

class Atendente extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, telefone,turno) {
        super(nome, cpf, 'ATENDENTE', email, dataNasc, endereco, telefone);
        this.senha = senha;
        this.turno = turno;
    }

    static validarAtendente(dados) {
        return Usuario.validarDadosUser(dados);
    }
}

module.exports = Atendente;