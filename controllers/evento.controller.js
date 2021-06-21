'use Strict'

var Evento = require('../models/evento.model');
var jwt = require('../services/jwt');


function saveEvento(req, res){
    var eventoModel = new Evento();
    var body = req.body;

    if(body.nombreEvento && body.descripcion && body.tipoEvento){
        

        eventoModel.nombreEvento = body.nombreEvento;
        eventoModel.descripcion = body.descripcion;
        eventoModel.tipoEvento = body.tipoEvento;
        eventoModel.role = "EVENTO";

    
        eventoModel.save((err, eventoGuardada)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion del Evento' });
            if(!eventoGuardada) return res.status(500).send({ message: 'Error al agregar el Evento' });
 
            return res.status(200).send({ eventoGuardada })
        })
    
    }else{
        return res.status(500).send({message: "Rellene todos los datos necesarios"})
    }
 }  



 function deleteEvento(req, res){
    var idEvento = req.params.id;

    if(req.use.role != "HOTEL"){
        res.status(403).send({message:"No tienes permisos para esta ruta"});    
    
    }else{
        Evento.findByIdAndRemove(idEvento,(err,deleted)=>{
            if(err){
                res.status(500).send({message:"Error en el servidor ", err});
            }else if(deleted){
                res.send({message:"Evento eliminado exitosamente"});
            }else{
                res.status(404).send({message:"El evento que quiere eliminar no existe"});
            }
        });
    }
    
}

function updateEvento(req, res){
    var idEvento = req.params.id;
    var update = req.body;

    if(req.use.role != "HOTEL"){
        res.status(403).send({message:"Error de permisos para esta ruta"});
    }else{
        Evento.findOne({name: update.nombreEvento}, (err, EventoRepeat)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor ", err});
            }else if(EventoRepeat){
                res.status(418).send({message:"El nombre de este Evento ya esta registrado"});
            }else{
                Evento.findByIdAndUpdate(idEvento, update, {new:true},(err,eventoUpdate)=>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor ", err});
                    }else if(eventoUpdate){
                        res.send({Evento_Actualizado: eventoUpdate});
                    }else{
                        res.status(404).send({message: "No ha seleccionado un evento para actualizar"});
                    }
                })
            }
        });
    }
    
}



 module.exports = {
    saveEvento,
    deleteEvento,
    updateEvento
  
}

