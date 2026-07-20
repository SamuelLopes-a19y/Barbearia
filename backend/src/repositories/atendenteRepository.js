const BaseRepository = require('./baseRepository');

class AtendenteRepository extends BaseRepository {
    constructor() {
        super('atendentes');
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

module.exports = new AtendenteRepository();