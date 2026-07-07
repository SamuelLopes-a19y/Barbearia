const BarbeiroRepo = require('../repositories/barbeiroRepository');
const ClienteRepo = require('../repositories/clienteRepository');
const AtendenteRepo = require('../repositories/atendenteRepository');
const AdminRepo = require('../repositories/adminRepository');

const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

module.exports = {
    async login(req, res) {
        try {
            const { email, senha, tipo } = req.body;
            let usuario = null;

            // Ajustamos o switch para os novos papéis da Barbearia
            switch(tipo.toLowerCase()) {
                case 'barbeiro': 
                    usuario = await BarbeiroRepo.findByEmail(email);
                    break;
                case 'cliente': 
                    usuario = await ClienteRepo.findByEmail(email);
                    break;
                case 'atendente': 
                    // Unifica as antigas funções de enfermeiro e recepcionista
                    usuario = await AtendenteRepo.findByEmail(email);
                    break;
                case 'admin':
                    usuario = await AdminRepo.findByEmail(email);
                    break;
                default: 
                    return res.status(400).json({ erro: "Tipo de utilizador inválido." });
            }

            if (!usuario) return res.status(401).json({ erro: "Utilizador não encontrado." });
            
            const senhaValida = await bcryptjs.compare(senha, usuario.senha);
            if (!senhaValida) return res.status(401).json({ erro: "Palavra-passe incorreta." });

            // Geração do token mantida, usando os dados atualizados
            const token = jwt.sign({ 
                id: usuario._id, 
                tipo: tipo.toLowerCase() 
            }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });

            res.status(200).json({
                mensagem: "Login realizado com sucesso!",
                token: token,
                usuario: { 
                    nome: usuario.nome,
                    tipo: tipo.toLowerCase(),
                    id: usuario._id
                }
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
};