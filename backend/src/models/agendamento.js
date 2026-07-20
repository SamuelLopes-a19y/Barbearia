const { ObjectId } = require("mongodb");

class Agendamento {
    constructor(data, descricao, status, horario, horarioFim, id_atendente, id_barbeiro, id_cliente) {
        this.data = data;
        this.descricao = descricao; 
        this.status = status; 
        this.horario = horario;
        this.horarioFim = horarioFim;
        this.id_atendente = new ObjectId(id_atendente); 
        this.id_barbeiro = new ObjectId(id_barbeiro);
        this.id_cliente = new ObjectId(id_cliente);
        this.data_criacao = new Date()
    }
}

module.exports = Agendamento;