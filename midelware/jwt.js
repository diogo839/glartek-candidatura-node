const jwt = require("jsonwebtoken");
const User = require("../models/user");

/**
 * Metodo usado como middleware para verificar se o token é valido
 * @param headers - jwt token
 * @returns {Promise<void>}
 */
exports.verifyToken = async (req, res, next) => {
    try{
    let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!token || !decoded) {
            res.status(401).json({
                status: "fail",
                message: "Utilizador não autenticado.",
                token: "",
            });
        }

        const user = await User.findOne({Email: decoded.payload.user.Email});

        if (!user) {
            res.status(401).json({
                status: "fail",
                message: "Utilizador não autenticado.",
                token: "",
            });
        }

        next();
    }catch (e) {
        console.log(e);
        res.status(500).json({e});
    }
}