class VendaProduto {
    constructor(id_produto, id_cliente, id_atendente, quantidade, valor_total) {
        this.id_produto = id_produto;
        this.id_cliente = id_cliente;
        this.id_atendente = id_atendente; // Atendente que realizou a venda
        this.quantidade = quantidade;
        this.valor_total = valor_total;
        this.data_venda = new Date();
    }
}

module.exports = VendaProduto;