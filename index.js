'use strict'

var mongoose = require('mongoose');
var port = 3000;
var app = require('./app');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/DBHotel', {useNewUrlParser: true, useUnifiedTopology: true})
    .then( ()=>{
        console.log('Conexion correcta a la base de datos')
        app.listen(port, () =>{
            console.log('EL servidor esta corriendo en el puerto ' + port)
        })
    })
    .catch( err =>{
        console.log('Error al conectarse a la base de datos', err)
    })

    module.exports = app;