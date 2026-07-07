module.exports = (req, res, next) => {
    if (req.userTipo === 'cliente' || req.userTipo === 'admin') {
        return next();
    }
    return res.status(403).json({ erro: "Acesso restrito a Clientes ou Administradores." });
};