'use strict'

var serviciosController = require('../controllers/servicios.controller');

// MIDDLEWARES === INTERMEDIARIO
var authentication = require("../middleware/autenticathed");

var express = require('express');
var api = express.Router();

// RUTAS
api.post('/saveServicio', authentication.ensureAuthHotel, serviciosController.saveServicio);
api.delete('/deleteServicio/:id', authentication.ensureAuthHotel, serviciosController.deleteServicio);
api.put('/updateServicio/:id', authentication.ensureAuthHotel, serviciosController.updateServicio);


module.exports = api;