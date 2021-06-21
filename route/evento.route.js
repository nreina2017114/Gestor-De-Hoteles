'use strict'

var eventoController = require('../controllers/evento.controller');

// MIDDLEWARES === INTERMEDIARIO
var authentication = require("../middleware/autenticathed");

var express = require('express');
var api = express.Router();

// RUTAS
api.post('/saveEvento', authentication.ensureAuthHotel, eventoController.saveEvento);
api.delete('/deleteEvento/:id', authentication.ensureAuthHotel, eventoController.deleteEvento);
api.put('/updateEvento/:id', authentication.ensureAuthHotel, eventoController.updateEvento);


module.exports = api;