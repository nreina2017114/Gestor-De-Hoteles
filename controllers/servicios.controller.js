'use Strict'

var Servicios = require('../models/servicios.model');
var jwt = require('../services/jwt');


function saveServicio(req, res){
    var servicioModel = new Servicios();
    var body = req.body;

    if(body.nombreServicio && body.descripcion && body.tipoServicio && body.precio){
        

        servicioModel.nombreServicio = body.nombreServicio;
        servicioModel.descripcion = body.descripcion;
        servicioModel.tipoServicio = body.tipoServicio;
        servicioModel.precio = body.precio;
        servicioModel.role = "SERVICIO";

    
        servicioModel.save((err, servicioGuardada)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion de Servicio' });
            if(!servicioGuardada) return res.status(500).send({ message: 'Error al agregar el Servicio' });
 
            return res.status(200).send({ servicioGuardada })
        })
    
    }else{
        return res.status(500).send({message: "Rellene todos los datos necesarios"})
    }
 }  



 function deleteServicio(req, res){
    var idServicio = req.params.id;

    if(req.use.role != "HOTEL"){
        res.status(403).send({message:"No tienes permisos para esta ruta"});    
    
    }else{
        Servicios.findByIdAndRemove(idServicio,(err,deleted)=>{
            if(err){
                res.status(500).send({message:"Error en el servidor ", err});
            }else if(deleted){
                res.send({message:"Servicio eliminado exitosamente"});
            }else{
                res.status(404).send({message:"El Servicio que quiere eliminar no existe"});
            }
        });
    }
    
}

function updateServicio(req, res){
    var idServicio = req.params.id;
    var update = req.body;

    if(req.use.role != "HOTEL"){
        res.status(403).send({message:"Error de permisos para esta ruta"});
    }else{
        Servicios.findOne({name: update.nombreServicio}, (err, ServicioRepeat)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor ", err});
            }else if(ServicioRepeat){
                res.status(418).send({message:"El nombre de este Servicio ya esta registrado"});
            }else{
                Servicios.findByIdAndUpdate(idServicio, update, {new:true},(err,ServicioUpdate)=>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor ", err});
                    }else if(ServicioUpdate){
                        res.send({Evento_Actualizado: ServicioUpdate});
                    }else{
                        res.status(404).send({message: "No ha seleccionado un servicio para actualizar"});
                    }
                })
            }
        });
    }
    
}



 module.exports = {
    saveServicio,
    deleteServicio,
    updateServicio
}

