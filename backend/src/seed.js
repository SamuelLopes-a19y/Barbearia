require('dotenv').config();
const { connect, getDb } = require('./database');
const { ObjectId } = require('mongodb');

// Senha padrão encriptada: "12345678"
const hashSenha = "$2b$08$wPE5xLM8chqL815ukf96s.KTwc2PF7qxl1.GhqiI8XbSCYgERJGIW";

// Nomes para geração aleatória
const nomesCliente = [
    "Rodrigo Almeida", "Bruno Silva", "Guilherme Santos", "Fernando Oliveira", "Lucas Pereira",
    "Thiago Souza", "Rafael Costa", "Gabriel Lima", "Matheus Rodrigues", "Pedro Alves",
    "Carlos Mendes", "André Barbosa", "Felipe Araújo", "Diego Cardoso", "Gustavo Freitas",
    "Vinícius Moreira", "Ricardo Nunes", "Eduardo Gomes", "Caio Ferreira", "Leonardo Dias",
    "Marcos Vieira", "Igor Teixeira", "Vitor Castro", "Bruno Rocha", "Paulo Santos",
    "Henrique Lima", "Fábio Oliveira", "Tiago Mendes", "Rogério Alves", "Sérgio Pereira",
    "Wellington Costa", "Adriano Silva", "Márcio Rodrigues", "Evandro Souza", "Júnior Barbosa",
    "Alexandre Cardoso", "Roberto Araújo", "José Moreira", "Antônio Ferreira", "Francisco Dias",
    "Daniel Vieira", "Samuel Teixeira", "Leandro Castro", "Jairo Rocha", "Walter Santos",
    "Ernesto Lima", "Maurício Oliveira", "Nelson Mendes", "Osvaldo Alves", "Plínio Pereira",
    "Renato Costa", "Saulo Silva", "Tarcísio Rodrigues", "Ubiratan Souza", "Vagner Barbosa",
    "Wilson Cardoso", "Xavier Araújo", "Yuri Moreira", "Zeca Ferreira", "Augusto Dias",
    "Beto Vieira", "César Teixeira", "Dário Castro", "Elton Rocha", "Fausto Santos",
    "Geraldo Lima", "Hélio Oliveira", "Ivan Mendes", "Jorge Alves", "Kleber Pereira",
    "Laerte Costa", "Murilo Silva", "Nildo Rodrigues", "Otávio Souza", "Plínio Barbosa",
    "Raul Cardoso", "Sílvio Araújo", "Túlio Moreira", "Ulisses Ferreira", "Valdir Dias",
    "Washington Vieira", "Xisto Teixeira", "Ziraldo Castro", "Abel Rocha", "Breno Santos",
    "Cláudio Lima", "Domingos Oliveira", "Edson Mendes", "Flávio Alves", "Genivaldo Pereira",
    "Helder Costa", "Ismael Silva", "Jaime Rodrigues", "Kenio Souza", "Luiz Barbosa",
    "Moacir Cardoso", "Nivaldo Araújo", "Orlando Moreira", "Pablo Ferreira", "Ronaldo Dias",
    "Sandro Vieira", "Tomás Teixeira", "Ulisses Castro", "Valter Rocha", "Wanderson Santos"
];

const nomesBarbeiros = [
    "Seu Jorge o Barbeiro", "Lucas Navalha", "Arthur Degradê",
    "Marcos Tesoura", "Roberto Máquina", "André Barba",
    "Felipe Pomada", "Diego Fade", "Gustavo Tesoura", "Vinícius Navalha"
];

const especialidades = [
    "Corte Clássico & Barba com Toalha Quente",
    "Degradê (Fade), Freestyle e Alisamento",
    "Barboterapia e Pigmentação",
    "Corte Social e Alinhamento",
    "Barba Desenhada e Corte Navalhado",
    "Corte Infantil e Adolescente",
    "Platinado e Coloração Masculina",
    "Barba Modelada com Balm",
    "Corte Asiático e K-Pop",
    "Corte Vintage e Old School"
];

const bairros = ["Centro", "Carneirinhos", "Vila Tanque", "Cruzeiro Celeste", "Baú", "Loanda", "Morada do Vale", "Novelino", "Alto Cruzeiro", "Alto dos Pinheiros"];
const tiposCabelo = ["Liso", "Ondulado", "Cacheado", "Afro", "Crespo", "Misto"];
const marcas = ["Barba Forte", "Sobrebarba", "Viking Brand", "Jack Black", "American Crew", "Redken", "L'Oréal Homme", "Baxter of California", "Proraso", "Truefitt & Hill"];

const produtos = [
    { nome: "Pomada Modeladora Efeito Matte", marca: marcas[0], preco: 45.90, qnt_estoque: 50 },
    { nome: "Óleo Hidratante para Barba Premium", marca: marcas[1], preco: 39.90, qnt_estoque: 30 },
    { nome: "Shampoo de Cabelo e Barba Mentolado", marca: marcas[2], preco: 34.90, qnt_estoque: 40 },
    { nome: "Cera Modeladora Extra Forte", marca: marcas[3], preco: 52.90, qnt_estoque: 25 },
    { nome: "Bálsamo para Barba com Manteiga de Karité", marca: marcas[4], preco: 48.90, qnt_estoque: 35 },
    { nome: "Pós-Barba Refrescante", marca: marcas[5], preco: 28.90, qnt_estoque: 20 },
    { nome: "Spray Fixador Forte", marca: marcas[6], preco: 32.90, qnt_estoque: 45 },
    { nome: "Óleo para Crescimento de Barba", marca: marcas[7], preco: 55.90, qnt_estoque: 15 },
    { nome: "Gel de Barbear Transparente", marca: marcas[8], preco: 22.90, qnt_estoque: 60 },
    { nome: "Máscara Capilar Reparadora", marca: marcas[9], preco: 42.90, qnt_estoque: 28 },
    { nome: "Condicionador Hidratante 250ml", marca: marcas[0], preco: 29.90, qnt_estoque: 55 },
    { nome: "Pomada à Base d'Água", marca: marcas[1], preco: 38.90, qnt_estoque: 42 },
    { nome: "Kit Barba Completo (Óleo + Balm + Shampoo)", marca: marcas[2], preco: 119.90, qnt_estoque: 18 },
    { nome: "Tônico para Crescimento Capilar", marca: marcas[3], preco: 67.90, qnt_estoque: 22 },
    { nome: "Creme de Pentear Masculino", marca: marcas[4], preco: 26.90, qnt_estoque: 50 },
    { nome: "Shampoo Seco Spray", marca: marcas[5], preco: 35.90, qnt_estoque: 33 },
    { nome: "Pomada Brilho Leve", marca: marcas[6], preco: 41.90, qnt_estoque: 38 },
    { nome: "Óleo de Argan para Barba", marca: marcas[7], preco: 59.90, qnt_estoque: 12 },
    { nome: "Sabonete Facial Masculino", marca: marcas[8], preco: 19.90, qnt_estoque: 70 },
    { nome: "Pó de Modelagem Texturizador", marca: marcas[9], preco: 44.90, qnt_estoque: 27 },
    { nome: "Clay Matte Ultra Forte", marca: marcas[0], preco: 49.90, qnt_estoque: 31 },
    { nome: "Leave-in Protetor Térmico", marca: marcas[1], preco: 36.90, qnt_estoque: 44 },
    { nome: "Óleo Essencial Cedro para Barba", marca: marcas[2], preco: 46.90, qnt_estoque: 20 },
    { nome: "Spray de Textura Sal Marinho", marca: marcas[3], preco: 33.90, qnt_estoque: 36 },
    { nome: "Cera de Barba com Argan", marca: marcas[4], preco: 51.90, qnt_estoque: 19 }
];

function gerarCPF(index) {
    const num = String(900000000 + index * 7).padStart(9, '0');
    return `${num.slice(0,3)}.${num.slice(3,6)}.${num.slice(6,9)}-${String(index % 100).padStart(2,'0')}`;
}

function gerarTelefone(index) {
    return `9${String(80000000 + index * 3).padStart(8, '0')}`;
}

function gerarDataNasc(index) {
    const year = 1980 + (index % 30);
    const month = 1 + (index % 12);
    const day = 1 + (index % 28);
    return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

async function povoarBanco() {
    try {
        console.log("A iniciar ligação com a base de dados...");
        await connect();
        const db = getDb();

        console.log("Apagando completamente o banco de dados anterior...");
        await db.dropDatabase(); 
        console.log("Banco limpo com sucesso! Criando novas estruturas...");

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

        // 2. Criar Atendentes (2)
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

        // 3. Criar 10 Barbeiros
        const barbeiroIds = [];
        const barbeirosDocs = nomesBarbeiros.map((nome, i) => {
            const id = new ObjectId();
            barbeiroIds.push(id);
            return {
                _id: id,
                nome: nome,
                cpf: gerarCPF(300 + i),
                email: `barbeiro${i+1}@barbearia.com`,
                senha: hashSenha,
                tipoPerfil: "BARBEIRO",
                dataNasc: gerarDataNasc(200 + i),
                telefone: gerarTelefone(200 + i),
                especialidade: especialidades[i],
                descricao: `${nome} - ${especialidades[i]}. Profissional dedicado com anos de experiência em cortar cabelo masculino e cuidar da barba.`,
                endereco: { estado: "Minas Gerais", cidade: "João Monlevade", bairro: bairros[i % bairros.length], rua: `Rua ${String.fromCharCode(65 + i)}`, cep: `35930-${String(i*50).padStart(3,'0')}`, numero: String(100 + i) },
                data_cadastro: new Date()
            };
        });
        await db.collection('barbeiros').insertMany(barbeirosDocs);

        // 4. Criar 100 Clientes
        const clienteIds = [];
        const clientesDocs = nomesCliente.map((nome, i) => {
            const id = new ObjectId();
            clienteIds.push(id);
            return {
                _id: id,
                nome: nome,
                cpf: gerarCPF(i),
                tipoPerfil: "CLIENTE",
                email: `cliente${i+1}@email.com`,
                dataNasc: gerarDataNasc(i),
                telefone: gerarTelefone(i),
                endereco: { estado: "Minas Gerais", cidade: "João Monlevade", bairro: bairros[i % bairros.length], rua: `Rua ${String.fromCharCode(65 + (i%26))}`, cep: `35930-${String(i*3).padStart(3,'0')}`, numero: String(i + 1) },
                data_cadastro: new Date(),
                preferencias: `Cliente ${i+1}. ${tiposCabelo[i % tiposCabelo.length]} é o tipo de cabelo.`,
                tipoCabelo: tiposCabelo[i % tiposCabelo.length]
            };
        });
        await db.collection('clientes').insertMany(clientesDocs);

        // 5. Criar 25 Produtos
        const produtoIds = [];
        const produtosDocs = produtos.map((prod, i) => {
            const id = new ObjectId();
            produtoIds.push(id);
            return {
                _id: id,
                nome: prod.nome,
                marca: prod.marca,
                preco: prod.preco,
                qnt_estoque: prod.qnt_estoque,
                id_atendente: i % 2 === 0 ? idAtendente1 : idAtendente2,
                data_cadastro: new Date()
            };
        });
        await db.collection('produtos').insertMany(produtosDocs);

        // 6. Criar Agendamentos (150 agendamentos distribuídos)
        const agendamentosDocs = [];
        const servicos = [
            "Corte de cabelo Degradê Navalhado",
            "Aparar barba com Toalha Quente",
            "Combo Completo: Cabelo, Barba e Sobrancelha",
            "Corte Social Tesoura",
            "Barboterapia Premium",
            "Degradê com Design",
            "Corte + Barba + Pigmentação",
            "Alisamento + Corte",
            "Barba Desenhada Artística",
            "Corte Infantil",
            "Platinado Masculino",
            "Manutenção de Barba",
            "Corte Masculino Clássico",
            "Sobrancelha na Navalha",
            "Combo Premium: Tudo incluso"
        ];
        const status = ["Agendado", "Confirmado", "Concluído", "Pendente"];
        
        for (let i = 0; i < 150; i++) {
            const clienteIdx = i % 100;
            const barbeiroIdx = i % 10;
            const dia = 1 + (i % 28);
            const mes = 6 + (i % 2); // Julho ou Agosto 2026
            const horaInicio = 8 + (i % 10);
            const horaFim = horaInicio + 1;
            
            agendamentosDocs.push({
                data: `2026-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`,
                descricao: servicos[i % servicos.length],
                status: status[i % status.length],
                horario: `${String(horaInicio).padStart(2,'0')}:00`,
                horarioFim: `${String(horaFim).padStart(2,'0')}:00`,
                id_atendente: i % 2 === 0 ? idAtendente1 : idAtendente2,
                id_barbeiro: barbeiroIds[barbeiroIdx],
                id_cliente: clienteIds[clienteIdx],
                data_criacao: new Date()
            });
        }
        await db.collection('agendamentos').insertMany(agendamentosDocs);

        // 7. Criar Histórico de Serviços (80 registros)
        const historicoDocs = [];
        for (let i = 0; i < 80; i++) {
            historicoDocs.push({
                servico_realizado: servicos[i % servicos.length],
                valor: 30 + (i % 70),
                id_barbeiro: barbeiroIds[i % 10],
                id_cliente: clienteIds[i % 100],
                data: new Date(2026, 5, 1 + (i % 30)) // Junho 2026
            });
        }
        await db.collection('historico_servicos').insertMany(historicoDocs);

        // 8. Criar Vendas de Produtos (60 vendas) - com campos compatíveis com o Histórico
        const vendasDocs = [];
        for (let i = 0; i < 60; i++) {
            const produtoIdx = i % 25;
            const clienteIdx = i % 100;
            const qtd = 1 + (i % 3);
            vendasDocs.push({
                _id: new ObjectId(),
                id_produto: produtoIds[produtoIdx],
                nome_produto: produtos[produtoIdx].nome,
                id_cliente: clienteIds[clienteIdx],
                id_atendente: i % 2 === 0 ? idAtendente1 : idAtendente2,
                quantidade: qtd,
                valor_total: +(produtos[produtoIdx].preco * qtd).toFixed(2),
                valor_unitario: produtos[produtoIdx].preco,
                dataVenda: new Date(2026, 5, 1 + (i % 30)),
                data_criacao: new Date(2026, 5, 1 + (i % 30))
            });
        }
        await db.collection('vendas_produtos').insertMany(vendasDocs);

        console.log("\n=========================================");
        console.log(" Base de dados Povoada com Sucesso!   ");
        console.log(" - 1 Administrador                    ");
        console.log(" - 2 Atendentes                       ");
        console.log(" - 10 Barbeiros                       ");
        console.log(" - 100 Clientes                       ");
        console.log(" - 25 Produtos                        ");
        console.log(" - 150 Agendamentos                   ");
        console.log(" - 80 Histórico de Serviços           ");
        console.log(" - 60 Vendas de Produtos              ");
        console.log("=========================================\n");

    } catch (error) {
        console.error("Erro crítico ao povoar a base de dados:", error);
    } finally {
        process.exit(0);
    }
}

povoarBanco();
