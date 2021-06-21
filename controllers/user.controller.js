'use Strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');

function saveUser(req, res){
    var user = new User();
    var body = req.body;

    if(body.name && body.nickname && body.password){
        User.findOne({nickname: body.nickname},(err, userRepeat)=>{
            if(err){
                res.status(500).send({message: "Error general del servidor", err});
            }else if(userRepeat){
                res.status(401).send({message:"Nombre de usuario ya existente"});
            }else{
                user.name = body.name;
                user.nickname = body.nickname;
                user.role = body.role;

                bcrypt.hash(body.password, null, null, (err, passwordEncrypt)=>{
                    if(err){
                        res.status(500).send({message:"Error en el servidor " ,  err});
                    }else if(passwordEncrypt){
                        user.password = passwordEncrypt;

                        user.save((err, userSaved)=>{
                            if(err){
                                res.status(500).send({message:"Error general en el servidor"});
                            }else if(userSaved){
                                res.send({User: userSaved});
                            }else{
                                res.status(404).send({message:"No se a podido guardar el usuario"});
                            }
                        });
                    }else{
                        res.status(418).send({message:"Error inesperado, no se pudo encriptar la contraseña"});
                    }
                })

            }
        });
    }else{
        res.status(404).send({message: "Mande todos los datos"});
    }
}

function updateUser(req, res){
    var idUser = req.params.id;
    var update = req.body; 

    if(req.use.sub != idUser){
        res.status(403).send({message:"No tienes permisos para esta ruta"});
    }else{
        User.findOne({nickname:update.nickname},(err,userRepeat)=>{
            if(err){
                res.status(500).send({message:"Error general en el servidor ",err});
            }else if(userRepeat){
                res.status(403).send({message:"No puede actualizar su nombre de usuario porque ya esta en uso"});
            }else{
                User.findByIdAndUpdate(idUser, update, {new:true},(err,updateUser) =>{
                    if(err){
                        res.status(500).send({message:"Error en el servidor ", err});
                    }else if(updateUser){
                        res.send({Usuario_Actualizado: updateUser});
                    }else{
                        res.status(404).send({message:"El usuario que quiere actualizar no existe"});
                    }
                });
            }
        });
    }
}

function listUser(req, res){
    
    User.find({}, (err,Users)=>{
        if(err){
            res.status(500).send({message:"Error en el servidor ", err});
        }else if(Users){
            res.send({Usuarios: Users});
        }else{
            res.send({message:"Error inesperado"});
        }
    })
}

function deleteUser(req, res){
    var idUser = req.params.id;

    if(req.use.sub != idUser){
        res.status(403).send({message:"No tienes permisos para esta ruta"});        
    }else{
        User.findByIdAndRemove(idUser,(err,deleted)=>{
            if(err){
                res.status(500).send({message:"Error en el servidor ", err});
            }else if(deleted){
                res.send({message:"Usuario eliminado exitosamente"});
            }else{
                res.status(404).send({message:"El usuario que quiere eliminar no existe"});
            }
        });
    }
    
}

module.exports = {
    saveUser,
    updateUser,
    deleteUser,
    listUser
}