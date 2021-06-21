'use strict'

var hotelController = require('../controllers/hotel.controller');
var authentication = require('../middleware/autenticathed');
var express = require('express');
var api = express.Router();

api.post('/saveHotel', authentication.ensureAuthAdmin, hotelController.saveHotel);
api.put('/updateHotel/:id', authentication.ensureAuthHotel,hotelController.updateHotel);
api.delete('/deleteHotel/:id', authentication.ensureAuthHotel, hotelController.deleteHotel);
api.get('/listHotels', hotelController.listHotel);

// Login de usuarios y hoteles
api.get('/login', hotelController.login);

// Listar de mayor a menor y de menor a mayor
api.put('/listarPorRango', hotelController.listMinMax);

//listar por fechas de reservacion de hotel
api.put('/listarPorNombre', authentication.ensureAuth,hotelController.rangeAlfabetic);

//listar por precios
api.put('/listarPorPrecio', authentication.ensureAuth, hotelController.rangePrice);

//listar por fechas
api.put('/listarPorFecha', authentication.ensureAuth, hotelController.rangeDates);
module.exports = api;