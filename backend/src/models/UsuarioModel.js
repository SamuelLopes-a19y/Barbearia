const bcryptjs = require('bcryptjs');
const Endereco = require('./EnderecoModel');

class Usuario {
    constructor(nome, cpf, tipoPerfil, email, senha, dataNasc, enderecoData, telefone) {
        this.nome = nome;
        this.cpf = cpf;
        this.tipoPerfil = tipoPerfil;
        this.email = email;
        this.senha = senha;
        this.dataNasc = dataNasc;
        this.data_cadastro = new Date();
        this.telefone = telefone;
        if(enderecoData) {
            this.endereco = new Endereco(
                enderecoData.estado,
                enderecoData.cidade,
                enderecoData.bairro,
                enderecoData.rua,
                enderecoData.cep,
                enderecoData.numero
            )
        } else {
            this.endereco = null;
        }
    }

    static validarDadosUser(usuario) {
        const erros = [];
        
        if (!usuario) { erros.push("O campo 'usuario' é obrigatório."); return erros; }
        if (!usuario.nome) erros.push("O campo 'nome' é obrigatório.");
        if (!usuario.cpf) erros.push("O campo 'cpf' é obrigatório.");
        if (!usuario.email && !usuario.email.includes('@')) erros.push("E-mail inválido.");
        if (!usuario.senha) erros.push("O campo 'senha' é obrigatório.");
        if (!usuario.dataNasc && typeof dataNasc !== 'number' && typeof usuario.dataNasc !== 'string') {
            erros.push("Data de nascimento inválida.");
        }
        if (!usuario.telefone && typeof usuario.telefone !== 'number') { erros.push("Telefone inválido.");}
        return erros;
    }

    async hashPassword() {
        this.senha = await bcryptjs.hash(this.senha, 8);
    }

    async passwordIsValid(password) {
        return await bcryptjs.compare(password, this.senha);
    }
}

module.exports = Usuario;