'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = "Clave_super_Secreta_para_hoteles";

exports.createToken = (user) =>{
    var payload = {
        sub: user._id,
        name: user.name,
        password: user.password,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(15, 'days').unix
    }

    return jwt.encode(payload, key);
}
