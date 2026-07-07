const Usuario = require("./usuario");

class Cliente extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, telefone, tipoCabelo, preferencias) {
        super(nome, cpf, 'CLIENTE', email, senha, dataNasc, endereco, telefone);
        this.tipoCabelo = tipoCabelo; // ex: Liso, Crespo, Ondulado
        this.preferencias = preferencias; // ex: "Gosta de café, não usa navalha"
    }

    static validarCliente(dados) {
        const erros = [];
        erros.push(...Usuario.validarDadosUser(dados));

        if (!dados.tipoCabelo) erros.push("O campo 'tipoCabelo' é obrigatório.");
        return erros;
    }
}

module.exports = Cliente;