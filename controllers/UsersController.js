const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const city = require('../models/city');


/**
 * Metodo para registar um utilizador
 * @param req - (name, email, password)
 * @param res - response do servidor com o token do utilizador a lista de cidades favoritas e o nome do utilizador
 * @returns {Promise<*>}
 * @constructor
 */
exports.Register = async (req, res) => {
    let {name, email, password} = req.body;
    try {
        const userCheck = await User.findOne({Email: email});
        if (!name || !email || !password) return res.status(400).json({error: "Ha campos em falta"});
        if (userCheck) return res.status(400).json({error: "Email ja existe"});
        if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)))
            return res.status(400).json({error: "A password deve conter no minimo 8 caracteres, uma letra e um numero!"});
        else
            bcrypt.genSalt(10, async (err, salt) => {
                bcrypt.hash(password, salt, async function (err, hash) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({error: "Erro no servidor"});
                    }
                    const user = await User.create({Name: name, Email: email, Password: hash});
                    const token = jwt.sign({payload: {user}}, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN,
                    });
                    res.status(201).json({
                        status: "success",
                        token,
                        favCities: user.FavCities,
                        name: user.Name
                    });
                })
            });


    } catch (e) {
        console.log(e);
        res.status(500).json({e});
    }
}


/**
 * Metodo para fazer login
 * @param req - (email, password) query params
 * @param res - response do servidor com o token do utilizador a lista de cidades favoritas e o nome do utilizador
 * @returns {Promise<*>}
 * @constructor
 */
exports.Login = async (req, res) => {
    try {
        const {email, password} = req.query;
        if (!email || !password) return res.status(400).json({error: "Ha campos em falta"});

        const user = await User.findOne({Email: email});

        if (!user) return res.status(400).json({error: "Nao existe nenhum utilizador com esse email"});
        bcrypt.compare(password, user.Password, function (err, result) {
            if (err) {
                console.log(err);
                return res.status(500).json({error: "Erro no servidor"});
            }
            if (result) {
                const token = jwt.sign({payload: {user}}, process.env.JWT_SECRET, {
                   expiresIn: process.env.JWT_EXPIRES_IN,
                });
                res.status(200).json({
                    status: "success",
                    token,
                    favCities: user.FavCities,
                    name: user.Name
                });
            } else {
                return res.status(400).json({error: "Password incorreta"});
            }
        });

    }catch (e) {
        console.log(e);
        res.status(500).json({e});
    }
}

exports.UpdateFavCities = async (req, res) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        const {cityId} = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({Email: decoded.payload.user.Email});
        const chekedcity = city.findOne({CityId: cityId});

        if(!chekedcity) {
            return res.status(404);
        }else {
            console.log(user);
            if (user.FavCities.includes(cityId)) {
                user.FavCities.splice(user.FavCities.indexOf(cityId), 1);
                user.save();
            } else {
                user.FavCities.push(cityId);
                user.save();
            }

            token = jwt.sign({payload: {user}}, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });
            res.status(200).json({
                status: "success",
                token,
                FavCities: user.FavCities
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({e});
    }
}

