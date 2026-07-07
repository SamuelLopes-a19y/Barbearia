const bcryptjs = require('bcryptjs');
const Barbeiro = require('../../models/BarbeiroModel');
const Endereco = require('../../models/EnderecoModel');
const BarbeiroRepo = require('../../repositories/BarbeiroRepository');
const GerenteRepo = require('../../repositories/GerenteRepository');
const AdminRepo = require('../../repositories/AdminRepository');

module.exports = {

    async create(req, res) {
        try {
            const dados = req.body;
            const erros = [];

            const errosMedi = Barbeiro.validarBarbeiro(dados);
            if (errosMedi.length > 0) erros.push(...errosMedi);

            if (dados.endereco) {
                const errosEnd = Endereco.validarEndereco(dados.endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }

            if (erros.length === 0) {
                const usuarioExistente = await BarbeiroRepo.findByCpfOrEmail(dados.cpf, dados.email);
                if (usuarioExistente) {
                    if (usuarioExistente.cpf === dados.cpf) erros.push("CPF já existe.");
                    if (usuarioExistente.email === dados.email) erros.push("E-mail já existe.");
                }
            }
            
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const { nome, cpf, email, senha, dataNasc, endereco, telefone, uf, registroProfissional, estilo, descricao } = dados;

            const barbeiro = new Barbeiro(
                nome,
                cpf,
                email,
                senha,
                dataNasc,
                endereco,
                telefone,
                uf,
                registroProfissional, 
                estilo, 
                descricao
            );  

            await barbeiro.hashPassword();

            const resultado = await BarbeiroRepo.create(barbeiro);

            res.status(201).json({
                mensagem: "Barbeiro cadastrado!",
                id_medic: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async list(req, res) {
        try {
            const barbeiros = await BarbeiroRepo.findAll();
            res.json(barbeiros);
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async select(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const barbeiro = await BarbeiroRepo.findById(id);
            if (!barbeiro) return res.status(404).json({erro: "Barbeiro não encontrado"});

            res.status(200).json(barbeiro);
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async update(req, res) {
        try {
            const { nome, cpf, email, senha , dataNasc, endereco, telefone, uf, registroProfissional, estilo, descricao, id_recep, id_medic, id_admin } = req.body;
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

            if (!id_medic) return res.status(400).json({erro: "ID do médico obrigatório"});
            const barbeiro = await BarbeiroRepo.findById(id_medic);
            if (!barbeiro) erros.push("Médico não encontrado.");

            if (erros.length > 0) return res.status(404).json({ erros });

            const dados = { nome, cpf, email, senha: senha || barbeiro.senha , dataNasc, endereco, telefone, uf, registroProfissional, estilo, descricao };

            const errosValidacao = Barbeiro.validarBarbeiro(dados);
            if (errosValidacao.length > 0) erros.push(...errosValidacao);
            
            if (endereco) {
                const errosEnd = Endereco.validarEndereco(endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }

            if (erros.length === 0) {
                const usuarioExistente = await BarbeiroRepo.findByCpfOrEmail(cpf, email);
                
                if (usuarioExistente) {
                    if (String(usuarioExistente._id) !== String(id_medic)) {
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
                uf, 
                registroProfissional, 
                estilo, 
                descricao
            };

            if (senha) {
                dadosAtualizados.senha = await bcryptjs.hash(senha, 8);
            }

            await BarbeiroRepo.update(id_medic, dadosAtualizados);

            res.status(200).json({ mensagem: "Barbeiro atualizado!" });

        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const resultado = await BarbeiroRepo.delete(id);

            if (!resultado || resultado.deletedCount === 0) {
                return res.status(404).json({ erro: "Barbeiro não encontrado para deletar." });
            }

            res.status(200).json({ mensagem: "Barbeiro deletado com sucesso!" });
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    }
}