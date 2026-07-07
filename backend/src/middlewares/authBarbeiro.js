module.exports = (req, res, next) => {
    if (req.userTipo === 'barbeiro' || req.userTipo === 'admin') {
        return next();
    }
    return res.status(403).json({ erro: "Acesso restrito a Barbeiros ou Administradores." });
};