module.exports = (req, res, next) => {
    if (req.userTipo === 'atendente' || req.userTipo === 'admin') {
        return next();
    }
    return res.status(403).json({ erro: "Acesso restrito a Atendentes ou Administradores." });
};