'user strict'

var Hotel = require("../models/hotel.model");
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user.model');
var jwt = require('../services/jwt');

function saveHotel(req, res){

    var body = req.body;
    var hotel = new Hotel();

    if(body.name && body.password && body.score && body.employees && body.date && body.owner){
        Hotel.findOne({name: body.name}, (err, HotelRepeat)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor ", err});
            }else if(HotelRepeat){
                res.status(402).send({message: "Este hotel ya esta registrado"});
            }else{
                hotel.name = body.name;
                hotel.score = body.score;
                hotel.employees = body.employees;
                hotel.dates = new Date(body.date);

                hotel.owner = body.owner;
                hotel.role = "HOTEL";

                bcrypt.hash(body.password, null, null, (err, passwrodEncrypt)=>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor ", err});
                    }else if(passwrodEncrypt){
                        hotel.password = passwrodEncrypt;

                        hotel.save((err, hotelSaved)=>{
                            if(err){
                                res.status(500).send({message:"Error general del servidor ", err});
                            }else if(hotelSaved){
                                res.send({Hotel_Guardado: hotelSaved});
                            }else{
                                res.send({message: "Error inesperado al guardar"});
                            }
                        });
                    }else{
                        res.status(400).send({message:"Error inesperado"});
                    }
                });
            }
        });
    }else{
        res.status(404).send({message: "Ingrese todos los datos"});
    }
}

function updateHotel(req, res){
    var idHotel = req.params.id;
    var update = req.body;

    if(idHotel != req.use.sub){
        res.status(403).send({message:"Error de permisos para esta ruta"});
    }else{
        Hotel.findOne({name: update.name}, (err, hotelRepeat)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor ", err});
            }else if(hotelRepeat){
                res.status(418).send({message:"El nombre de este hotel ya esta registrado"});
            }else{
                Hotel.findByIdAndUpdate(idHotel, update, {new:true},(err,hotelUpdate)=>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor ", err});
                    }else if(hotelUpdate){
                        res.send({Hotel_Actualizado: hotelUpdate});
                    }else{
                        res.status(404).send({message: "No ha seleccionado un hotel para actualizar"});
                    }
                })
            }
        });
    }
    
}

function deleteHotel(req, res){
    var idHotel = req.params.id;

    if(idHotel != req.use.sub){
        res.status(403).send({message:"Error de permisos para esta ruta"});
        console.log(req.use.sub)
    }else{
        Hotel.findByIdAndRemove(idHotel,(err,deleted)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor ", err});
            }else if(deleted){
                res.send({message: "Hotel Eliminado"});
            }else{
                res.status(404).send({message: "No ha indicado que hotel quiere eliminar"});
            }
        });
    }
    
}

function listHotel(req, res){
    
    Hotel.find({}, (err, Hotels)=>{
        if(err){
            res.status(500).send({message:"Error general del servidor ", err});
        }else if(Hotels){
            res.send({message:Hotels});
        }else{
            res.status(400).send({message:"Error inesperado al listar los hoteles"});
        }
    })
}

function login(req, res){
    var body = req.body;

    if(body.nickname && body.password){
        User.findOne({$or:[{nickname: body.nickname}, {name:body.name}]}, (err, UserExist)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor ", err});
            }else if(UserExist){
                bcrypt.compare(body.password, UserExist.password, (err, passwordok)=>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor ", err});
                    }else if(passwordok){
                        res.send({token: jwt.createToken(UserExist)});
                    }else{
                        res.status(400).send({message:"La contraseña no coincide con el usuario"});
                    }
                })
            }else{  
                res.status(404).send({message: "El usario no existe"})
            }
        })
    }else if (body.name && body.password){
        Hotel.findOne({name: body.name}, (err, HotelExist)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor ", err});
            }else if(HotelExist){
                bcrypt.compare(body.password, HotelExist.password,(err, passwordcheck) =>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor ", err});
                    }else if(passwordcheck){
                        res.send({token: jwt.createToken(HotelExist)});
                    }else{
                        res.status(400).send({message:"La contraseña no coincide con el usuario"});
                    }
                })
            }else{
                res.status(404).send({message:"Nombre de usuario no existe"});
            }
        });
    }else{
        res.status(500).send({message:"Ingrese todos los datos"});
    }
}

function listMinMax(req, res){
    var body = req.body;

    if(body.MenorAMayorPuntaje != null){
        Hotel.find({}, null,{sort:{score: 1}}, (err, findmax)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor ", err});
            }else if(findmax){
                res.send({Hoteles:findmax});
            }else{
                res.status(404).send({message:"No hay hoteles"});
            }
        });
    }else if(body.MayorAMenorPuntaje != null){
        Hotel.find({},null, {sort:{score:-1}}, (err,findMin)=>{
            if(err){
                res.status(500).send({message:"Error general en el servidor", err});
            }else if(findMin){
                res.send({Hoteles_De_Menor_Rango: findMin});
            }else{
                res.status(404).send({message:"No hay usuarios"});
            }
        });
    }
}


function rangeAlfabetic(req, res){
    var body = req.body;
    var idHotel = req.params.id;
    
    if(req.use.role == "USER"){
        if(body.asc != null){
            Hotel.find({},null,{sort:{name:-1}}, (err,hotel)=>{
                if(err){
                    res.status(500).send({message:"Error general en el servidor", err});
                }else if(hotel){
                    res.send({Hoteles_Ordenados_En_Rango_Alfabetico:hotel});
                }else{
                    res.status(404).send({message:"Ingrese los parametros de busqueda"});
                }
            });     
        }else if(body.desc != null){
            Hotel.find({},null,{sort:{name:1}}, (err,hotel)=>{
                if(err){
                    res.status(500).send({message:"Error general en el servidor", err});
                }else if(hotel){
                    res.send({Hoteles_Ordenados_En_Rango_Alfabetico:hotel});
                }else{
                    res.status(404).send({message:"Ingrese los parametros de busqueda"});
                }
            });     
        }else{
            res.status(406).send({message:"Ingrese el orden de busqueda: asc/desc"})
        }
        
    }else{
        res.status(403).send({message:"No tiene permisos para esta"});        
    }
}



function rangePrice(req, res){
    var body = req.body;

    if(req.use.role == "USER"){
        if(body.asc){
            Hotel.find({}, null, {sort:{pricerooms: 1}},(err, asc)=>{
                if(err){
                    res.status(500).send({message:"Error general del servidor ", err});
                }else if(asc){
                    res.send({Precios_Del_Barato_Al_los_Caros: asc});
                }else{
                    res.status(404).send({message:"No hay Precios de hoteles"});
                }
            });
        }else if(body.desc){
            Hotel.find({}, null, {sort:{pricerooms: -1}},(err, desc)=>{
                if(err){
                    res.status(500).send({message:"Error general del servidor ", err});
                }else if(desc){
                    res.send({Precios_Del_Caro_Al_los_Baratos: desc});
                }else{
                    res.status(404).send({message:"No hay Precios de hoteles"});
                }
            });
        }else{
            res.status(406).send({message:"Ingrese los parametros: asc/desc"});
        }
        
    }else{
        res.status(403).send({message:"No tiene permisos para esta ruta"});
    }
}

function rangeDates(req, res){
    var body = req.body;
    
    if(req.use.role == 'USER'){
        Hotel.find({dates:{$lte:new Date(body.dates)}},null,{sort:{dates:-1}}, (err,hotel)=>{
            if(err){
                res.status(500).send({message:"Error general en el servidor", err});
            }else if(hotel){
                res.send({Hoteles_Ordenados_En_Rango_Alfabetico:hotel});
                console.log(hotel.dates);
            }else{
                res.status(404).send({message:"Ingrese los parametros de busqueda"});
            }
        });
    }else{
        res.status(403).send({message:"No tiene permisos para esta"});        
    }
}

module.exports = {
    saveHotel,
    updateHotel,
    deleteHotel,
    listHotel,
    login,
    listMinMax,
    rangeAlfabetic,
    rangePrice,
    rangeDates
}