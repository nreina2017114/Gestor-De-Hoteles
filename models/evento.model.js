'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventoSchema = Schema({
    nombreEvento: String,
    descripcion: String,
    tipoEvento: String,
    role: String,

});

module.exports = mongoose.model('evento', eventoSchema);