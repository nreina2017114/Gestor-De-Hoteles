'use strict'

// VARIABLES GLOBALES
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

// IMPORTACION DE EUTAS
var userRoute = require('./route/user.route');
var hotelRoute = require('./route/hotel.route');
var habitacionRoute = require('./route/habitacion.route');
var eventoRoute = require('./route/evento.route');
var servicioRoute = require('./route/servicios.route');



// MIDDLEWARES
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// APLICACION DE RUTAS
app.use('/api', userRoute);
app.use('/api', hotelRoute);
app.use('/api', habitacionRoute);
app.use('/api', eventoRoute);
app.use('/api', servicioRoute);




//EXPORTAR
module.exports = app;


