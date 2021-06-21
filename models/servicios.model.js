'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serviciosSchema = Schema({
    nombreServicio: String,
    descripcion: String,
    tipoServicio: String,
    precio: String,
    role: String,

});

module.exports = mongoose.model('servicios', serviciosSchema);