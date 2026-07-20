const Usuario = require("./usuario");

class Admin extends Usuario {
    constructor(nome, cpf, email, senha) {
        super(nome, cpf, 'ADMIN', email, null, null, null);
        this.senha = senha;
    }
}

module.exports = Admin;
