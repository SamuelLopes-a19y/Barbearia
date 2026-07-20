require('dotenv').config();
const { connect, getDb } = require('./database');
const { ObjectId } = require('mongodb');

// Senha padrão encriptada: "12345678"
const hashSenha = "$2b$08$wPE5xLM8chqL815ukf96s.KTwc2PF7qxl1.GhqiI8XbSCYgERJGIW"; 

async function povoarBanco() {
    try {
        console.log("A iniciar ligação com a base de dados...");
        await connect();
        const db = getDb();

        console.log("Apagando completamente o banco de dados anterior...");
        await db.dropDatabase(); 
        console.log("Banco limpo com sucesso! Criando novas estruturas...");

        console.log("A limpar coleções antigas para evitar duplicados..."); 
        await db.collection('admins').deleteMany({}); 
        await db.collection('atendentes').deleteMany({});
        await db.collection('barbeiros').deleteMany({});
        await db.collection('clientes').deleteMany({});
        await db.collection('produtos').deleteMany({});
        await db.collection('vendas_produtos').deleteMany({});
        await db.collection('agendamentos').deleteMany({}); 
        await db.collection('historico_servicos').deleteMany({});

        console.log("A gerar dados de teste para a Barbearia...");

        // 1. Criar Administrador
        const idAdmin = new ObjectId(); 
        await db.collection('admins').insertOne({
            _id: idAdmin,
            nome: "Carlos Admin",
            cpf: "000.000.000-00",
            email: "admin@barbearia.com",
            senha: hashSenha,
            tipoPerfil: "ADMIN",
            data_cadastro: new Date()
        });

        // 2. Criar Atendentes
        const idAtendente1 = new ObjectId(); 
        const idAtendente2 = new ObjectId();
        await db.collection('atendentes').insertMany([
            {
                _id: idAtendente1,
                nome: "Mariana Costa",
                cpf: "111.222.333-44",
                email: "mariana@barbearia.com",
                senha: hashSenha,
                tipoPerfil: "ATENDENTE",
                dataNasc: "1995-05-12",
                telefone: "912345678",
                turno: "Manhã",
                endereco: { estado: "Minas Gerais", cidade: "João Monlevade", bairro: "Centro", rua: "Rua A", cep: "35930-000", numero: "123" },
                data_cadastro: new Date()
            },
            {
                _id: idAtendente2,
                nome: "Pedro Souza",
                cpf: "222.333.444-55",
                email: "pedro@barbearia.com",
                senha: hashSenha,
                tipoPerfil: "ATENDENTE",
                dataNasc: "1998-09-20",
                telefone: "918765432",
                turno: "Tarde",
                endereco: { estado: "Minas Gerais", cidade: "João Monlevade", bairro: "Carneirinhos", rua: "Rua B", cep: "35930-100", numero: "456" },
                data_cadastro: new Date()
            }
        ]);

        // 3. Criar Barbeiros
        const idBarbeiro1 = new ObjectId();
        const idBarbeiro2 = new ObjectId();
        const idBarbeiro3 = new ObjectId();
        await db.collection('barbeiros').insertMany([
            {
                _id: idBarbeiro1,
                nome: "Seu Jorge o Barbeiro",
                cpf: "333.444.555-66",
                email: "jorge@barbearia.com",
                senha: hashSenha,
                tipoPerfil: "BARBEIRO",
                dataNasc: "1988-02-15",
                telefone: "922223333",
                especialidade: "Corte Clássico & Barba com Toalha Quente",
                descricao: "Especialista em visagismo masculino com mais de 10 anos de experiência.",
                endereco: { estado: "Minas Gerais", cidade: "João Monlevade", bairro: "Centro", rua: "Av. Wilson Alvarenga", cep: "35930-001", numero: "789" },
                data_cadastro: new Date()
            },
            {
                _id: idBarbeiro2,
                nome: "Lucas Navalha",
                cpf: "444.555.666-77",
                email: "lucas@barbearia.com",
                senha: hashSenha,
                tipoPerfil: "BARBEIRO",
                dataNasc: "1993-07-22",
                telefone: "933334444",
                especialidade: "Degradê (Fade), Freestyle e Alisamento",
                descricao: "Focado em cortes modernos, designs urbanos e tendências da cultura.",
                endereco: { estado: "Minas Gerais", cidade: "João Monlevade", bairro: "Vila Tanque", rua: "Rua C", cep: "35930-150", numero: "12" },
                data_cadastro: new Date()
            },
            {
                _id: idBarbeiro3,
                nome: "Arthur Degradê",
                cpf: "555.666.777-88",
                email: "arthur@barbearia.com",
                senha: hashSenha,
                tipoPerfil: "BARBEIRO",
                dataNasc: "1996-11-05",
                telefone: "944445555",
                especialidade: "Barboterapia e Pigmentação",
                descricao: "Especialista em cuidados para a pele masculina e técnicas avançadas de barba.",
                endereco: { estado: "Minas Gerais", cidade: "João Monlevade", bairro: "Cruzeiro Celeste", rua: "Rua D", cep: "35930-200", numero: "99" },
                data_cadastro: new Date()
            }
        ]);

        // 4. Criar Clientes
        const idCliente1 = new ObjectId();
        const idCliente2 = new ObjectId();
        const idCliente3 = new ObjectId();
        await db.collection('clientes').insertMany([
            {
                _id: idCliente1,
                nome: "Rodrigo Almeida",
                cpf: "666.777.887-99",
                tipoPerfil: "CLIENTE",
                email: "rodrigo@gmail.com",
                dataNasc: "1990-04-10",
                telefone: "955556666",
                endereco: { estado: "Minas Gerais", cidade: "João Monlevade", bairro: "Centro", rua: "Rua E", cep: "35930-000", numero: "10" },
                data_cadastro: new Date(),
                preferencias: "Prefere degradê alto e café expresso bem forte.",
                tipoCabelo: "Afro",
            },
            {
                _id: idCliente2,
                nome: "Bruno Silva",
                cpf: "777.888.999-00",
                tipoPerfil: "CLIENTE",
                email: "bruno@hotmail.com",
                dataNasc: "1994-08-18",
                telefone: "966667777",
                endereco: { estado: "Minas Gerais", cidade: "João Monlevade", bairro: "Baú", rua: "Rua F", cep: "35930-300", numero: "220" },
                data_cadastro: new Date(),
                preferencias: "Mantém a barba cheia, gosta de lavar com shampoo mentolado.",
                tipoCabelo: "Liso",
            },
            {
                _id: idCliente3,
                nome: "Guilherme Santos",
                cpf: "888.999.000-11",
                tipoPerfil: "CLIENTE",
                email: "guilherme@outlook.com",
                dataNasc: "2001-12-25",
                telefone: "977778888",
                endereco: { estado: "Minas Gerais", cidade: "João Monlevade", bairro: "Loanda", rua: "Rua G", cep: "35930-400", numero: "5" },
                data_cadastro: new Date(),
                preferencias: "Corte social feito estritamente na tesoura, não gosta de máquina.",
                tipoCabelo: "Ondulado",
            }
        ]);

        // 5. Criar Produtos (Campo corrigido para 'estoque' para bater com as rotas)
        const idProduto1 = new ObjectId();
        const idProduto2 = new ObjectId();
        const idProduto3 = new ObjectId();
        await db.collection('produtos').insertMany([
            {
                _id: idProduto1,
                nome: "Pomada Modeladora Efeito Matte",
                marca: "Barba Forte",
                preco: 45.90,
                estoque: 50,
                id_atendente: idAtendente1,
                data_cadastro: new Date() 
            },
            {
                _id: idProduto2,
                nome: "Óleo Hidratante para Barba Premium",
                marca: "Sobrebarba",
                preco: 39.90,
                estoque: 30,
                id_atendente: idAtendente1,
                data_cadastro: new Date() 
            },
            {
                _id: idProduto3,
                nome: "Shampoo de Cabelo e Barba Mentolado",
                marca: "Viking Brand",
                preco: 34.90,
                estoque: 40,
                id_atendente: idAtendente2,
                data_cadastro: new Date() 
            }
        ]);

        // 6. Criar Agendamentos
        await db.collection('agendamentos').insertMany([
            {
                data: "2026-07-10",
                descricao: "Corte de cabelo Degradê Navalhado",
                status: "Agendado",
                horario: "09:00",
                horarioFim: "09:45",
                id_atendente: idAtendente1,
                id_barbeiro: idBarbeiro1,
                id_cliente: idCliente1,
                data_criacao: new Date() 
            },
            {
                data: "2026-07-10",
                descricao: "Aparar barba com Toalha Quente",
                status: "Agendado",
                horario: "10:00",
                horarioFim: "10:30",
                id_atendente: idAtendente1,
                id_barbeiro: idBarbeiro1,
                id_cliente: idCliente2,
                data_criacao: new Date() 
            },
            {
                data: "2026-07-11",
                descricao: "Combo Completo: Cabelo, Barba e Sobrancelha",
                status: "Pendente",
                horario: "14:00",
                horarioFim: "15:15",
                id_atendente: idAtendente2,
                id_barbeiro: idBarbeiro2,
                id_cliente: idCliente3,
                data_criacao: new Date() 
            }
        ]);

        // 7. Criar Histórico de Serviços
        await db.collection('historico_servicos').insertMany([
            {
                servico_realizado: "Corte Degradê + Sobrancelha na navalha",
                valor: 60.00,
                id_barbeiro: idBarbeiro1,
                id_cliente: idCliente1,
                data: new Date() 
            },
            {
                servico_realizado: "Barboterapia completa com óleos essenciais",
                valor: 40.00,
                id_barbeiro: idBarbeiro2,
                id_cliente: idCliente2,
                data: new Date() 
            }
        ]);

        // 8. Criar Vendas de Produtos
        await db.collection('vendas_produtos').insertMany([
            {
                id_produto: idProduto1,
                id_cliente: idCliente1,
                id_atendente: idAtendente1,
                quantidade: 1,
                valor_total: 45.90,
                data: new Date() 
            },
            {
                id_produto: idProduto2,
                id_cliente: idCliente2,
                id_atendente: idAtendente2,
                quantidade: 2,
                valor_total: 79.80,
                data: new Date() 
            }
        ]); 

        console.log("\n=========================================");
        console.log(" Base de dados Povoada com Sucesso!   ");
        console.log(" Todos os dados fictícios foram criados. ");
        console.log("=========================================\n");

    } catch (error) {
        console.error("Erro crítico ao povoar a base de dados:", error);
    } finally {
        process.exit(0);
    }
}

povoarBanco();