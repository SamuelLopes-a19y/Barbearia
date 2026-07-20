class Endereco {
    constructor(estado, cidade, bairro, rua, cep, numero) {
        this.estado = estado;
        this.cidade = cidade; 
        this.bairro = bairro; 
        this.rua = rua; 
        this.cep = cep; 
        this.numero = numero; 
    }

    toJSON() {
        return {
        estado: this.estado,
        cidade: this.cidade,
        bairro: this.bairro,
        rua: this.rua,
        cep: this.cep,
        numero: this.numero,
        };
    }

    static validarEndereco(endereco) {
        const erros = [];
        if (!endereco) return ["Dados de endereço não informados."];
        if (!endereco.estado) erros.push("O campo 'estado' é obrigatório.");
        if (!endereco.cidade) erros.push("O campo 'cidade' é obrigatório.");
        if (!endereco.bairro) erros.push("O campo 'bairro' é obrigatório.");
        if (!endereco.rua) erros.push("O campo 'rua' é obrigatório.");
        if (!endereco.cep) erros.push("O campo 'cep' é obrigatório.");
        if (!endereco.numero) erros.push("O campo 'numero' é obrigatório.");
        return erros;
    }
}

module.exports = Endereco;
