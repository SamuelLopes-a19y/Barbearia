const BaseRepository = require('./BaseRepository');

class VendaProdutoRepository extends BaseRepository {
    constructor() {
        super('vendas_produtos');
    }
}

module.exports = new VendaProdutoRepository();