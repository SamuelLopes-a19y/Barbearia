const BaseRepository = require('./baseRepository'); 
const { ObjectId } = require('mongodb');

class ProdutoRepository extends BaseRepository {
    constructor() {
        super('produtos'); 
    }

    async diminuirEstoque(id, qnt) {
        const db = this.getDb();
        return await db.updateOne(
            { _id: new ObjectId(id) },
            // $inc com valor negativo subtrai do campo 'estoque'
            { $inc: { qnt_estoque: -qnt } } 
        );
    }
}

module.exports = new ProdutoRepository();