class HistoricoServico {
    constructor(detalhes_corte, num_pente_lateral, id_barbeiro, id_cliente) {
        this.detalhes_corte = detalhes_corte; // ex: "Degradê do 0 navalhado, topo tesoura"
        this.num_pente_lateral = num_pente_lateral; // ex: "Pente 1.5"
        this.id_barbeiro = id_barbeiro;
        this.id_cliente = id_cliente;   
        this.data = new Date();
    }
}

module.exports = HistoricoServico;