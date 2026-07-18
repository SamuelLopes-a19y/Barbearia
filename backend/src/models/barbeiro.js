const Usuario = require("./usuario");

class Barbeiro extends Usuario {
    constructor(nome, cpf, email, senha, dataNasc, endereco, telefone, especialidades, descricao) {
        super(nome, cpf, 'BARBEIRO', email, senha, dataNasc, endereco, telefone);
        this.especialidades = especialidades; 
        this.descricao = descricao; 
    }

    static validarBarbeiro(dados) {
        const erros = [];
        erros.push(...Usuario.validarDadosUser(dados));

        if (!dados.especialidades) erros.push("O campo 'especialidades' é obrigatório.");
        if (!dados.descricao) erros.push("O campo 'descricao' é obrigatório.");
        return erros;
    }
}

module.exports = Barbeiro;