class Produto {
    constructor(nome, marca, qnt_estoque, id_atendente) {
        this.nome = nome;
        this.marca = marca;
        this.qnt_estoque = qnt_estoque;
        this.id_atendente = id_atendente; // Quem cadastrou/atualizou o item
        this.data_cadastro = new Date();
    }
}

module.exports = Produto;