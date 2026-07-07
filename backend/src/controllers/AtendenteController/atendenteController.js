const bcryptjs = require('bcryptjs');
const Atendente = require('../../models/AtendenteModel');
const Endereco = require('../../models/EnderecoModel');
const AtendenteRepo = require('../../repositories/AtendenteRepository');
const GerenteRepo = require('../../repositories/GerenteRepository');
const AdminRepo = require('../../repositories/AdminRepository');

module.exports = {

    async create(req, res) {
        try {
            const dados = req.body;
            const erros = [];

            const errosEnferm = Atendente.validarAtendente(dados);
            if (errosEnferm.length > 0) erros.push(...errosEnferm);

            if (dados.endereco) {
                const errosEnd = Endereco.validarEndereco(dados.endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }

            if (erros.length === 0) {
                const usuarioExistente = await AtendenteRepo.findByCpfOrEmail(dados.cpf, dados.email);
                if (usuarioExistente) {
                    if (usuarioExistente.cpf === dados.cpf) erros.push("CPF já existe.");
                    if (usuarioExistente.email === dados.email) erros.push("E-mail já existe.");
                }
            }
            
            if (erros.length > 0) {
                return res.status(400).json({ erros });
            }

            const { nome, cpf, email, senha, dataNasc, endereco, telefone, uf, coren } = dados;
            
            const atendente = new Atendente(
                nome,
                cpf,
                email,
                senha,
                dataNasc,
                endereco,
                telefone,
                uf,
                coren
            );

            await atendente.hashPassword();

            const resultado = await AtendenteRepo.create(atendente);

            res.status(201).json({
                mensagem: "Atendente cadastrado!",
                id_enfer: resultado.insertedId
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async list(req, res) {
        try {
            const atendentes = await AtendenteRepo.findAll();
            res.json(atendentes);
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async select(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const atendente = await AtendenteRepo.findById(id);
            if (!atendente) return res.status(404).json({erro: "Atendente não encontrado"});

            res.status(200).json(atendente);
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    },

    async update(req, res) {
        try {
            const { nome, cpf, email, senha , dataNasc, endereco, telefone, uf, coren, id_recep, id_enfer, id_admin } = req.body;
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

            if (!id_enfer) return res.status(400).json({erro: "ID atendente obrigatório"});
            const atendente = await AtendenteRepo.findById(id_enfer);
            if (!atendente) erros.push("Atendente não encontrado.");

            if (erros.length > 0) return res.status(404).json({ erros });

            const dados = { nome, cpf, email, senha: senha || atendente.senha , dataNasc, endereco, telefone, uf, coren };

            const errosValidacao = Atendente.validarAtendente(dados);
            if (errosValidacao.length > 0) erros.push(...errosValidacao);
            
            if (endereco) {
                const errosEnd = Endereco.validarEndereco(endereco);
                if (errosEnd.length > 0) erros.push(...errosEnd);
            }

            if (erros.length === 0) {
                const usuarioExistente = await AtendenteRepo.findByCpfOrEmail(cpf, email);
                
                if (usuarioExistente) {
                    if (String(usuarioExistente._id) !== String(id_enfer)) {
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
                coren 
            };
            
            if (senha) {
                dadosAtualizados.senha = await bcryptjs.hash(senha, 8);
            }

            await AtendenteRepo.update(id_enfer, dadosAtualizados);

            res.status(200).json({ mensagem: "Atendente atualizado!" });

        } catch (error) {
            res.status(500).json({ erro: error.message});
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({erro: "ID não encontrado"});

            const resultado = await AtendenteRepo.delete(id);

            if (!resultado || resultado.deletedCount === 0) {
                return res.status(404).json({ erro: "Atendente não encontrado para deletar." });
            }

            res.status(200).json({ mensagem: "Atendente deletado com sucesso!" });
        } catch (error) {
            res.status(500).json({erro : error.message});
        }
    }
}