const Usuario = require("./UsuarioModel");

class Cliente extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, telefone, preferenciaCorte) {
        super(nome, cpf, 'CLIENTE', email, senha, dataNasc, endereco, telefone);
        this.preferenciaCorte = preferenciaCorte;
    }

    static validarCliente(dados) {
        const erros = [];
        erros.push(...Usuario.validarDadosUser(dados));

        if (!dados.preferenciaCorte) erros.push("O campo 'preferenciaCorte' é obrigatório.");
        return erros;
    }
}

module.exports = Cliente;