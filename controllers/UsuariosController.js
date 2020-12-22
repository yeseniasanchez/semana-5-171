const models = require('../models');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const config = require('../secret/config.js');
const BCRYPT_SALT_ROUNDS = 12;

module.exports = {
    add: async (req, res, next) => {
        try {
            const reg = await models.Usuario.create({
                nombre: req.body.nombre, 
                rol: req.body.rol,
                password: await bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS),
                email: req.body.email,
                estado: 1
            });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },

    query: async (req, res, next) => {
        try {
            const reg = await models.Usuario.findOne({ where: { id: req.query.id } });
            if (!reg) {
                res.status(404).send({
                    message: 'El registro no existe'
                });
            } else {
                res.status(200).json(reg);
            }
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },

    list: async (req, res, next) => {
        try {
            const reg = await models.Usuario.findAll();
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },

    remove: async (req, res, next) => {
        try {
            const reg = await models.Usuario.destroy({
                where: {
                    id:
                        req.body.id
                }
            });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },


    update: async (req, res, next) => {
        try {
            const reg = await models.Usuario.update({
                nombre: req.body.nombre, 
                rol: req.body.rol,
                password: await bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS),
                email: req.body.email
            }, { where: { id: req.body.id } });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },

    activate: async (req, res, next) => {
        try {
            console.log(req.body.id);
            const reg = await models.Usuario.update({ estado: 1 }, { where: { id: req.body.id } });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    deactivate: async (req, res, next) => {
        try {
            const reg = await models.Usuario.update({ estado: 0 }, { where: { id: req.body.id } });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },















    signin: async (req, res) => {

        models.Usuario.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
    
            if (!user) {
                return res.status(404).send('User Not Found.');
            }
    
            var passwordIsValid = bcrypt.compareSync(req.body.password,
                user.password);
    
            if (!passwordIsValid) {
                return res.status(401).send({
                    auth: false, tokenReturn: null,
                    reason: "Invalid Password!"
                });
            }
    
            var token = jwt.sign({
                id: user.id,
                rol: user.rol
            }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            
            res.status(200).send({ auth: true, tokenReturn: token });
        }).catch(err => {
            res.status(500).send('Error -> ' + err);
        });
    }












}

