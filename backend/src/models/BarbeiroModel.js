const Usuario = require("./UsuarioModel");

class Barbeiro extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, telefone, uf, registroProfissional, estilo, descricao) {
        super(nome, cpf, 'BARBEIRO', email, senha, dataNasc, endereco, telefone);
        this.uf = uf;
        this.registroProfissional = registroProfissional;
        this.estilo = estilo;
        this.descricao = descricao;
    }

    static validarBarbeiro(dados) {
        const erros = [];
        erros.push(...Usuario.validarDadosUser(dados));

        if (!dados.estilo) erros.push("O campo 'estilo' é obrigatório.");
        if (!dados.descricao) erros.push("O campo 'descricao' é obrigatório.");
        if (!dados.uf) erros.push("O campo 'UF' é obrigatório.");
        if (!dados.registroProfissional && typeof registroProfissional !== 'number' && typeof dados.registroProfissional !== 'string') {
            erros.push("REGISTROPROFISSIONAL inválida.");
        }
        return erros;
    }
}

module.exports = Barbeiro;