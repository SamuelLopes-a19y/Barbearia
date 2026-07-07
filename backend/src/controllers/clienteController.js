const bcryptjs = require('bcryptjs');
const Cliente = require('../models/cliente'); // Ajustado caminho relativo conforme contexto anterior
const ClienteRepo = require('../repositories/clienteRepository');
const Endereco = require('../models/EnderecoModel'); // Mantenha o caminho correto do seu projeto para o Endereco
const AtendenteRepo = require('../repositories/atendenteRepository'); // Substituindo Recepcionista por Atendente do seu print
const AdminRepo = require('../repositories/adminRepository'); // Substituindo Admin pelo seu repositório correspondente

module.exports = {

    async create(req, res) {
        try {
            const dados = req.body;
            const erros = [];

            // Validação dos dados do Cliente
            const errosCliente = Cliente.validarCliente(dados);
            if (errosCliente.length > 0) erros.push(...errosCliente);

            // Validação opcional de Endereço
            if (dados.endereco) {
                const errosEnd = Endereco.validarEndereco(dados.endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }

            // Verifica duplicidade se não houver erros prévios de validação
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

            const { nome, cpf, email, senha, dataNasc, endereco, telefone, tipoCabelo, preferencias } = dados;

            // Instanciando a classe Cliente com a assinatura correta do seu constructor
            const cliente = new Cliente(
                nome, 
                cpf, 
                email, 
                senha, 
                dataNasc, 
                endereco, 
                telefone, 
                tipoCabelo, 
                preferencias
            );

            // Criptografa a senha (garanta que o método hashPassword exista na classe herdada Usuario)
            await cliente.hashPassword();

            const resultado = await ClienteRepo.create(cliente);

            res.status(201).json({
                mensagem: "Cliente cadastrado com sucesso!",
                id_cliente: resultado.insertedId
            });
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
            const { nome, cpf, email, senha, dataNasc, endereco, telefone, tipoCabelo, preferencias, id_atendente, id_cliente, id_admin } = req.body;
            const erros = [];

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

            const dados = {
                nome, cpf, email, senha: senha || cliente.senha, dataNasc, 
                endereco, telefone, tipoCabelo, preferencias
            };

            // Revalidação dos dados atualizados
            const errosValidacao = Cliente.validarCliente(dados);
            if (errosValidacao.length > 0) erros.push(...errosValidacao);
            
            if (endereco) {
                const errosEnd = Endereco.validarEndereco(endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }

            if (erros.length === 0) {
                const usuarioExistente = await ClienteRepo.findByCpfOrEmail(cpf, email);
                
                if (usuarioExistente) {
                    if (String(usuarioExistente._id) !== String(id_cliente)) {
                        if (usuarioExistente.cpf === cpf) erros.push("Este CPF já está sendo usado por outro usuário.");
                        if (usuarioExistente.email === email) erros.push("Este E-mail já está sendo usado por outro usuário.");
                    }
                }
            }

            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const dadosAtualizados = {
                nome, 
                cpf, 
                email, 
                dataNasc, 
                endereco, 
                telefone, 
                tipoCabelo,
                preferencias
            };

            if (senha) {
                dadosAtualizados.senha = await bcryptjs.hash(senha, 8);
            }

            await ClienteRepo.update(id_cliente, dadosAtualizados);

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