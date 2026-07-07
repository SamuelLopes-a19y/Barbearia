// const VendaProduto = require('../models/vendaProduto'); // Model não existe, usando objeto literal
const VendaProdutoRepo = require('../repositories/vendaProdutoRepository');
const BaseRepository = require('../repositories/baseRepository');
const ProdutoRepo = new BaseRepository('produtos');
const ClienteRepo = require('../repositories/clienteRepository');
const AtendenteRepo = require('../repositories/atendenteRepository');

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
            const venda = {
                id_produto: new ObjectId(id_produto),
                id_cliente: new ObjectId(id_cliente),
                id_atendente: new ObjectId(id_atendente),
                quantidade: Number(quantidade),
                valor_total: Number(valor_total),
                data_venda: new Date()
            };
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
    },
    async list(req, res) {
        try {
            const vendas = await VendaProdutoRepo.findAll();
            res.json(vendas);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },
    async select(req, res) {
        try {
            const { id } = req.query;
            if (!id) return res.status(400).json({ erro: "ID não informado" });
            const venda = await VendaProdutoRepo.findById(id);
            res.json(venda);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
};