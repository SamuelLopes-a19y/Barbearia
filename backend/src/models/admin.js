const Usuario = require("./usuario");

class Admin extends Usuario {
    constructor(nome, cpf, email, senha) {
        super(nome, cpf, 'ADMIN', email, senha, null, null, null);
    }
}

module.exports = Admin;
