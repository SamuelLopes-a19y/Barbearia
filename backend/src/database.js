const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

let dbInstance = null;

const client = new MongoClient(process.env.CONNECTIONSTRING, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
    
async function connect() {
    if (dbInstance) return dbInstance;

    try {
        await client.connect();
        console.log("Conectado ao MongoDB com sucesso!");
        
        // Altera o nome do banco de dados para o contexto da Barbearia
        // Se houver DB_NAME no .env ele usa, senão padroniza para "Barbearia"
        const dbName = process.env.DB_NAME || "Barbearia";
        dbInstance = client.db(dbName);
        console.log(`Banco de dados ativo: [${dbName}]`);

    } catch (error) {
        console.error("Erro crítico ao conectar à base de dados!");
        console.error(error);
        process.exit(1);
    }
}

function getDb() {
    if (!dbInstance) throw new Error("A base de dados não foi inicializada corretamente.");
    return dbInstance;
}

module.exports = { connect, getDb };