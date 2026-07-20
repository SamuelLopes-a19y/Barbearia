const bcryptjs = require('bcryptjs');
const Cliente = require('../models/cliente'); 
const ClienteRepo = require('../repositories/ClienteRepository');
const Endereco = require('../models/EnderecoModel'); 
const AtendenteRepo = require('../repositories/atendenteRepository'); 
const AdminRepo = require('../repositories/adminRepository');

module.exports = {

    async create(req, res) {
        try {
            const {...dados} = req.body;
            const erros = [];

            const cliente = new Cliente(req.body.nome, req.body.cpf, req.body.email, req.body.dataNasc, req.body.endereco, req.body.telefone, req.body.tipoCabelo, req.body.preferencias);  

            const erroscliente = cliente.validarCliente(dados);
            if (erroscliente.length > 0) erros.push(...erroscliente);

            if (erros.length === 0) {
                const usuarioExistente = await ClienteRepo.findByCpfOrEmail(dados.cpf, dados.email);
                if (usuarioExistente) {
                    if (usuarioExistente.cpf === dados.cpf) erros.push("CPF já existe.");
                    if (usuarioExistente.email === dados.email) erros.push("E-mail já existe.");
                }
            }
            
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            await cliente.hashPassword();

            const resultado = await ClienteRepo.create(cliente);

            res.status(201).json({
                mensagem: "cliente cadastrado com sucesso!",
                id_cliente: resultado.insertedId
            });

        } catch (error) {
            console.log(error)
            res.status(500).json({ erro: error.message });
        }
    },

    async list(req, res) {
        try {
            const clientes = await ClienteRepo.findAll();
            res.json(clientes);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async select(req, res) {
        try {
            const id = req.query.id || req.body.id;

            if (!id) {
                return res.status(400).json({ erro: "ID do cliente não fornecido para a busca." });
            }

            const cliente = await ClienteRepo.findById(id);

            if (!cliente) {
                return res.status(404).json({ erro: "cliente não encontrado." });
            }

            res.status(200).json(cliente);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async list(req, res) {
        try {
            const clientes = await ClienteRepo.findAll();
            res.json(clientes);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async select(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({ erro: "ID não encontrado" });

            const cliente = await ClienteRepo.findById(id);
            if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" });

            res.status(200).json(cliente);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async update(req, res) {
        try {
            const { nome, cpf, email, dataNasc, endereco, telefone, tipoCabelo, preferencias, id_atendente, id_cliente, id_admin } = req.body;
            const erros = [];
            const novoCliente = new Cliente(req.body.nome, req.body.cpf, req.body.email, req.body.dataNasc, req.body.endereco, req.body.telefone, req.body.tipoCabelo, req.body.preferencias)
            // Validação de quem está alterando (Admin ou Atendente do salão/barbearia)
            if (id_admin) {
                const admin = await AdminRepo.findById(id_admin);
                if (!admin) erros.push("Admin não encontrado.");
            } else {
                if (!id_atendente) return res.status(400).json({ erro: "ID do atendente/funcionário obrigatório" });
                const atendente = await AtendenteRepo.findById(id_atendente);
                if (!atendente) erros.push("Atendente não encontrado.");
            }

            if (!id_cliente) return res.status(400).json({ erro: "ID do cliente obrigatório" });
            const cliente = await ClienteRepo.findById(id_cliente);
            if (!cliente) erros.push("Cliente não encontrado.");

            if (erros.length > 0) return res.status(404).json({ erros });

            // Revalidação dos dados atualizados
            /*const errosValidacao = Cliente.validarCliente(dados);
            if (errosValidacao.length > 0) erros.push(...errosValidacao);
            
            if (endereco) {
                const errosEnd = Endereco.validarEndereco(endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }*/

            if (erros.length === 0) {
                const usuarioExistente = await ClienteRepo.findByCpfOrEmail(novoCliente.cpf, novoCliente.email);
                
                if (usuarioExistente) {
                    if (String(usuarioExistente._id) !== String(id_cliente)) {
                        if (usuarioExistente.cpf === novoCliente.cpf) erros.push("Este CPF já está sendo usado por outro usuário.");
                        if (usuarioExistente.email === novoCliente.email) erros.push("Este E-mail já está sendo usado por outro usuário.");
                    }
                }
            }

            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            await ClienteRepo.update(id_cliente, novoCliente);

            res.status(200).json({ mensagem: "Cliente atualizado com sucesso!" });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({ erro: "ID não encontrado" });

            const resultado = await ClienteRepo.delete(id);
            
            if (!resultado || resultado.deletedCount === 0) {
                return res.status(404).json({ erro: "Cliente não encontrado para deletar." });
            }

            res.status(200).json({ mensagem: "Cliente deletado com sucesso!" });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
}