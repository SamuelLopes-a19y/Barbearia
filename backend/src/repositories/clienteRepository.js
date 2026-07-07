const BaseRepository = require('./baseRepository');

class ClienteRepository extends BaseRepository {
    constructor() {
        super('clientes');
    }

    async findByCpfOrEmail(cpf, email) {
        return await this.getDb().findOne({
            $or: [{ cpf }, { email }]
        });
    }
    
    async findByEmail(email) {
        return await this.getDb().findOne({ email });
    }
}

module.exports = new ClienteRepository();