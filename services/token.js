var jwt = require('jsonwebtoken');
const models = require('../models');
const config = require('../secret/config.js');

module.exports = {

    //generar el token
    encode: async(id, rol) => {
        return jwt.sign({
            id: id,
            rol: rol
        }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
    },
    //permite decodificar el token
    decode: async(token) => {
        try {
            return jwt.decode(token);
        } catch (e) {
            return null;
        }
    }
}