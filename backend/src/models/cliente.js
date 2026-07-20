const Usuario = require("./usuario");
const Endereco = require('../models/EnderecoModel');

class Cliente extends Usuario {
    constructor(nome, cpf, email, dataNasc, endereco, telefone, tipoCabelo, preferencias) {
        
        super(nome, cpf, 'CLIENTE', email, dataNasc, endereco, telefone);
        this.preferencias = preferencias; 
        this.tipoCabelo = tipoCabelo;
    }

    validarCliente(dados) {
        const erros = [];
        erros.push(...Usuario.validarDadosUser(dados));

        const errosEnd = Endereco.validarEndereco(dados.endereco); 
        if (errosEnd.length > 0) erros.push(...errosEnd);

        if (!dados.tipoCabelo) erros.push("O campo 'tipoCabelo' é obrigatório.");
        return erros;
    }
}

module.exports = Cliente;