'use strict'

var habitacionController = require('../controllers/habitacion.controller');

// MIDDLEWARES === INTERMEDIARIO
var authentication = require("../middleware/autenticathed");

var express = require('express');
var api = express.Router();

// RUTAS
api.post('/saveHabitacion', authentication.ensureAuthHotel, habitacionController.saveHabitacion);
api.delete('/deleteHabitacion/:id', authentication.ensureAuthHotel, habitacionController.deleteHabitacion);
api.put('/updateHabitacion/:id', authentication.ensureAuthHotel,habitacionController.updateHabitacion);


module.exports = api;