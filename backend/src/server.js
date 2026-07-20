require('dotenv').config();
const app = require('./app');
const { connect } = require('./database'); 

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await connect(); 
    
    
    app.listen(PORT, () => {
      console.log(`\n=========================================`);
      console.log(`  Servidor da Barbearia Online e Ativo!  `);
      console.log(`  Aceda em: http://localhost:${PORT}     `);
      console.log(`=========================================\n`);
    });

  } catch (error) {
    console.error("Falha crítica ao iniciar o servidor da Barbearia:", error);
  }
}

start();