const VendaProduto = require('../../models/vendaProduto');

const VendaProdutoRepo = require('../../repositories/VendaProdutoRepository');
const ProdutoRepo = require('../../repositories/ProdutoRepository'); // Antigo Medicamento
const ClienteRepo = require('../../repositories/ClienteRepository');
const AtendenteRepo = require('../../repositories/AtendenteRepository');

const { ObjectId } = require('mongodb');

module.exports = {
    async create(req, res) {
        try {
            const { id_produto, id_cliente, id_atendente, quantidade, valor_total } = req.body;
            const erros = [];

            if (!id_produto) erros.push("ID do produto é obrigatório.");
            if (!id_cliente) erros.push("ID do cliente é obrigatório.");
            if (!id_atendente) erros.push("ID do atendente é obrigatório.");
            if (!quantidade || quantidade <= 0) erros.push("Quantidade inválida.");

            if (erros.length > 0) return res.status(400).json({ erros });

            // Verificar existências
            const produto = await ProdutoRepo.findById(id_produto);
            const cliente = await ClienteRepo.findById(id_cliente);
            const atendente = await AtendenteRepo.findById(id_atendente);

            if (!produto) return res.status(404).json({ erro: "Produto não encontrado no stock." });
            if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado." });
            if (!atendente) return res.status(404).json({ erro: "Atendente não encontrado." });

            // Verificar Stock
            const estoqueAtual = produto.qnt_estoque;
            if (estoqueAtual < quantidade) {
                return res.status(400).json({ erro: `Estoque insuficiente. Disponível: ${estoqueAtual}` });
            }

            // 1. Criar Registo de Venda
            const venda = new VendaProduto(
                new ObjectId(id_produto),
                new ObjectId(id_cliente),
                new ObjectId(id_atendente),
                Number(quantidade),
                Number(valor_total) // Adicionámos o valor para fecho de caixa
            );
            await VendaProdutoRepo.create(venda);

            // 2. Atualizar Stock do Produto
            const novaQuantidade = estoqueAtual - Number(quantidade);
            await ProdutoRepo.update(id_produto, { 
                qnt_estoque: novaQuantidade
            });

            res.status(201).json({ 
                mensagem: "Venda registada com sucesso! Stock atualizado.",
                novo_estoque: novaQuantidade
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
};