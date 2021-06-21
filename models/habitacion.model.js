'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var habitacionSchema = Schema({
    nameHabitacion: String,
    Disponibilidad: String,
    Hotel: { type: Schema.Types.ObjectId, ref: 'hotel'},
    role: String,


    
});

module.exports = mongoose.model('habitacion', habitacionSchema);