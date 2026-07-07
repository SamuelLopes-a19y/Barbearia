class Agendamento {
    constructor(data, descricao, status, horario, horarioFim, id_atendente, id_barbeiro, id_cliente) {
        this.data = data;
        this.descricao = descricao; // ex: "Corte de cabelo + barba com toalha quente"
        this.status = status; // ex: "Pendente", "Concluído", "Cancelado"
        this.horario = horario;
        this.horarioFim = horarioFim;
        this.id_atendente = id_atendente; // Pode ser nulo se o cliente agendou sozinho online
        this.id_barbeiro = id_barbeiro;
        this.id_cliente = id_cliente;
        this.data_criacao = new Date();
    }
}

module.exports = Agendamento;