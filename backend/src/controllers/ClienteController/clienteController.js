const bcryptjs = require('bcryptjs');
const Cliente = require('../../models/ClienteModel');
const ClienteRepo = require('../../repositories/ClienteRepository');
const Endereco = require('../../models/EnderecoModel');
const GerenteRepo = require('../../repositories/GerenteRepository');
const AdminRepo = require('../../repositories/AdminRepository');

module.exports = {

    async create(req, res) {
        try {
            const dados = req.body;
            const erros = [];

            const errosPaci = Cliente.validarCliente(dados);
            if (errosPaci.length > 0) erros.push(...errosPaci);

            if (dados.endereco) {
                const errosEnd = Endereco.validarEndereco(dados.endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }

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

            const { nome, cpf, email, senha, dataNasc, endereco, telefone, preferenciaCorte } = dados;

            const cliente = new Cliente(
                nome, 
                cpf, 
                email, 
                senha, 
                dataNasc, 
                endereco, 
                telefone, 
                preferenciaCorte
            );

            await cliente.hashPassword();

            const resultado = await ClienteRepo.create(cliente);

            res.status(201).json({
                mensagem: "Cliente cadastrado!",
                id_paci: resultado.insertedId
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
            res.status(500).json({erro : error.message});
        }
    },

    async select(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const cliente = await ClienteRepo.findById(id);
            if (!cliente) return res.status(404).json({erro: "Cliente não encontrado"});

            res.status(200).json(cliente);
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async update(req, res) {
        try {
            const { nome, cpf, email, senha , dataNasc, endereco, telefone, preferenciaCorte, id_recep, id_paci, id_admin } = req.body;
            const erros = [];

            if(id_admin) {
                if (!id_admin) return res.status(400).json({erro: "ID admin obrigatório"});
                const admin = await AdminRepo.findById(id_admin);
                if (!admin) erros.push("Admin não encontrado.");
            } else {
                if (!id_recep) return res.status(400).json({erro: "ID gerente obrigatório"});
                const gerente = await GerenteRepo.findById(id_recep);
                if (!gerente) erros.push("Gerente não encontrado.");
            }

            if (!id_paci) return res.status(400).json({ erro: "ID do cliente obrigatório" });
            const cliente = await ClienteRepo.findById(id_paci);
            if (!cliente) erros.push("Cliente não encontrado.");

            if (erros.length > 0) return res.status(404).json({ erros });

            const dados = {
                nome, cpf, email, senha: senha || cliente.senha , dataNasc, 
                endereco, telefone, preferenciaCorte
            };

            const errosValidacao = Cliente.validarCliente(dados);
            if (errosValidacao.length > 0) erros.push(...errosValidacao);
            
            if (endereco) {
                const errosEnd = Endereco.validarEndereco(endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }

            if (erros.length === 0) {
                const usuarioExistente = await ClienteRepo.findByCpfOrEmail(cpf, email);
                
                if (usuarioExistente) {
                    if (String(usuarioExistente._id) !== String(id_paci)) {
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
                preferenciaCorte 
            };

            if (senha) {
                dadosAtualizados.senha = await bcryptjs.hash(senha, 8);
            }

            await ClienteRepo.update(id_paci, dadosAtualizados);

            res.status(200).json({ mensagem: "Cliente atualizado!" });
        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const resultado = await ClienteRepo.delete(id);
            
            if (!resultado || resultado.deletedCount === 0) {
                return res.status(404).json({ erro: "Cliente não encontrado para deletar." });
            }

            res.status(200).json({ mensagem: "Cliente deletado com sucesso!" });
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    }
}