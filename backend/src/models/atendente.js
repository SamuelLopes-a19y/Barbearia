const Usuario = require("./usuario");

class Atendente extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, telefone) {
        super(nome, cpf, 'ATENDENTE', email, senha, dataNasc, endereco, telefone);
    }

    static validarAtendente(dados) {
        return Usuario.validarDadosUser(dados);
    }
}

module.exports = Atendente;