const bcryptjs = require('bcryptjs');
const Endereco = require('../models/EnderecoModel');

class Usuario {
    constructor(nome, cpf, tipoPerfil, email, dataNasc, enderecoData, telefone) {
        this.nome = nome;
        this.cpf = cpf;
        this.tipoPerfil = tipoPerfil?.toUpperCase();
        this.email = email;
        this.dataNasc = dataNasc;
        this.telefone = String(telefone);
        
        if (enderecoData) {
            const endereco = new Endereco(
                enderecoData.estado,
                enderecoData.cidade,
                enderecoData.bairro,
                enderecoData.rua,
                enderecoData.cep,
                enderecoData.numero
            );

            this.endereco = endereco.toJSON();
        } else {
            this.endereco = null;
        }
        this.data_cadastro = new Date();
    }

    static validarDadosUser(usuario) {
        const erros = [];
        
        if (!usuario) { 
            erros.push("O campo 'usuario' é obrigatório."); 
            return erros; 
        }
        
        if (!usuario.nome) erros.push("O campo 'nome' é obrigatório.");
        if (!usuario.cpf) erros.push("O campo 'cpf' é obrigatório.");

        if (!usuario.email || !usuario.email.includes('@')) {
            erros.push("E-mail inválido ou não informado.");
        }
        
        // if (!usuario.senha) erros.push("O campo 'senha' é obrigatório.");
        
        if (!usuario.dataNasc) {
            erros.push("O campo 'dataNasc' (Data de nascimento) é obrigatório.");
        }

        if (!usuario.telefone) { 
            erros.push("O campo 'telefone' é obrigatório.");
        }
        
        return erros;
    }

    async hashPassword() {
        if (this.senha) {
            this.senha = await bcryptjs.hash(this.senha, 8);
        }
    }
}

module.exports = Usuario;