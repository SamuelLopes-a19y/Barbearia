const BaseRepository = require('./baseRepository');

class VendaProdutoRepository extends BaseRepository {
    constructor() {
        super('vendas_produtos');
    }
}

module.exports = new VendaProdutoRepository();