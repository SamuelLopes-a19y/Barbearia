const Usuario = require("./UsuarioModel");

class Gerente extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, telefone, turno) {
        super(nome, cpf, 'GERENTE', email, senha, dataNasc, endereco, telefone);
        this.turno = turno;
    }

    static validarGerente(dados) {
        const erros = [];
        erros.push(...Usuario.validarDadosUser(dados));

        if (!dados.turno) erros.push("O campo 'turno' é obrigatório.");
        return erros;
    }
}

module.exports = Gerente;