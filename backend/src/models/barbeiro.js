const Usuario = require("./usuario");
const Endereco = require('../models/EnderecoModel');

class Barbeiro extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, telefone, especialidade, descricao) {
        super(nome, cpf, 'BARBEIRO', email, dataNasc, endereco, telefone);
        this.senha = senha;
        this.especialidade = especialidade; 
        this.descricao = descricao;
    }

    static validarBarbeiro(dados) {
        const erros = [];
        erros.push(...Usuario.validarDadosUser(dados));

        if (!dados.especialidade) erros.push("O campo 'especialidade' é obrigatório.");
        if (!dados.descricao) erros.push("O campo 'descricao' é obrigatório.");
        return erros;
    }
}

module.exports = Barbeiro;