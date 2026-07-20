const { MongoClient } = require('mongodb');
require('dotenv').config();

let dbInstance = null;

const uri = process.env.CONNECTIONSTRING;

const client = new MongoClient(uri, {
    retryWrites: true,
    w: 'majority',
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
});
    
async function connect() {
    if (dbInstance) return dbInstance;

    try {
        await client.connect();
        // Verifica a conexão com um ping rápido
        await client.db().command({ ping: 1 });
        console.log("Conectado ao MongoDB com sucesso!");
        
        const dbName = process.env.DB_NAME || "Barbearia";
        dbInstance = client.db(dbName);
        console.log(`Banco de dados ativo: [${dbName}]`);

    } catch (error) {
        console.error("Erro crítico ao conectar à base de dados!");
        console.error("Detalhes:", error.message);
        console.error("Verifique a CONNECTIONSTRING no .env e a versão do driver MongoDB.");
        throw error;
    }
}

function getDb() {
    if (!dbInstance) throw new Error("A base de dados não foi inicializada corretamente. Execute connect() primeiro.");
    return dbInstance;
}

module.exports = { connect, getDb };
