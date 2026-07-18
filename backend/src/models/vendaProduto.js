class vendaProduto {
    constructor(id_produto, id_cliente, id_atendente, quantidade) {
        this.id_produto = id_produto;
        this.id_cliente = id_cliente;
        this.id_atendente = id_atendente;
        this.quantidade = quantidade;
        this.dataVenda = new Date(); 
    }

    static validarVenda(dados) {
        const erros = [];
        
        if (!dados.id_produto) erros.push("ID do produto é obrigatório.");
        if (!dados.id_cliente) erros.push("ID do cliente é obrigatório.");
        if (!dados.id_atendente) erros.push("ID do atendente (vendedor) é obrigatório.");
        if (!dados.quantidade || typeof dados.quantidade !== 'number' || dados.quantidade <= 0) {
            erros.push("Quantidade inválida.");
        }

        return erros;
    }
}

module.exports = vendaProduto;