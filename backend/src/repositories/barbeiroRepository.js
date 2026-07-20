const BaseRepository = require('./baseRepository');

class BarbeiroRepository extends BaseRepository {
    constructor() {
        super('barbeiros');
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

module.exports = new BarbeiroRepository();