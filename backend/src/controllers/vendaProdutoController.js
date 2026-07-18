const Produto = require('../models/produto');
const VendaProduto = require('../models/vendaProduto'); 
const ProdutoRepo = require('../repositories/produtoRepository');
const ClienteRepo = require('../repositories/clienteRepository');
const AtendenteRepo = require('../repositories/atendenteRepository');
const VendaProdutoRepo = require('../repositories/vendaProdutoRepository'); 
const { ObjectId } = require('mongodb'); 

module.exports = {

    async create(req, res) {
        try {
            const { nome, marca, estoque, id_atendente } = req.body;
            const erros = [];

            if (!nome) erros.push("O campo 'nome' é obrigatório.");
            if (!marca) erros.push("O campo 'marca' é obrigatório.");
            if (!id_atendente) erros.push("O campo 'id_atendente' é obrigatório (Quem está cadastrando?).");
            if (estoque && typeof estoque !== 'number') erros.push("Quantidade de estoque inválida.");
            
            const atendente = await AtendenteRepo.findById(id_atendente);
            if (!atendente) erros.push("Atendente não encontrado.");

            if (erros.length > 0) return res.status(400).json({ erros });

            const produto = new Produto(
                nome,
                marca,
                estoque,
                new ObjectId(id_atendente)
            );
            
            const resultado = await ProdutoRepo.create(produto);

            res.status(201).json({
                mensagem: "Produto cadastrado com sucesso!",
                id: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async list(req, res) {
        try {
            const produtos = await VendaProdutoRepo.findAll();
            res.json(produtos);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },
    
    async select(req, res) {
        try {
            const id = req.query.id || req.body.id;
            
            if (!id) return res.status(400).json({ erro: "ID da venda não informado" });

            const venda = await VendaProdutoRepo.findById(id);
            if (!venda) return res.status(404).json({ erro: "Venda não encontrada" });

            res.status(200).json(venda);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async update(req, res) {
        try {
            const dados = req.body;
            const id = dados.id || dados._id; 
            
            if (!id) return res.status(400).json({ erro: "ID da venda é obrigatório." });

            const resultado = await VendaProdutoRepo.update(id, dados);

            if (resultado.matchedCount === 0 || !resultado) {
                return res.status(404).json({ erro: "Venda não encontrada para atualização." });
            }

            res.status(200).json({
                mensagem: "Venda atualizada com sucesso!",
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }, 

    async delete(req, res) {
        try {
            const id = req.body.id || req.query.id;
            if (!id) return res.status(400).json({ erro: "ID da venda não informado" });

            const resultado = await VendaProdutoRepo.delete(id);
            
            if (!resultado || resultado.deletedCount === 0) {
                return res.status(404).json({ erro: "Venda não encontrada para deletar." });
            }

            res.status(200).json({ mensagem: "Venda deletada com sucesso!" });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async realizarVenda(req, res) {
        try {
            const { id_produto, quantidade, id_cliente, id_atendente } = req.body;
            const erros = [];

            if (!id_produto) erros.push("ID do produto é obrigatório.");
            if (!quantidade) erros.push("Quantidade é obrigatória.");
            if (!id_cliente) erros.push("ID do cliente é obrigatório.");
            if (!id_atendente) erros.push("ID do atendente (vendedor) é obrigatório.");
            if (erros.length > 0) return res.status(400).json({ erros });

            const produto = await ProdutoRepo.findById(id_produto);
            const cliente = await ClienteRepo.findById(id_cliente);
            const atendente = await AtendenteRepo.findById(id_atendente);

            if (!produto) return res.status(404).json({ erro: "Produto não encontrado no estoque." });
            if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado." });
            if (!atendente) return res.status(404).json({ erro: "Atendente não encontrado." });
            
            if (produto.estoque < quantidade) {
                return res.status(400).json({ erro: `Estoque insuficiente. Disponível: ${produto.estoque}` });
            }

            await ProdutoRepo.diminuirEstoque(id_produto, quantidade);

            const registroVenda = new VendaProduto(
                new ObjectId(id_produto),
                new ObjectId(id_cliente),
                new ObjectId(id_atendente),
                quantidade
            );
            
            await VendaProdutoRepo.create(registroVenda);

            res.status(200).json({ 
                mensagem: "Venda realizada e registrada com sucesso!",
                estoque_restante: produto.estoque - quantidade,
                comprovante: registroVenda
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
};