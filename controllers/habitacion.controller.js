'use Strict'

var Habitacion = require('../models/habitacion.model');
var jwt = require('../services/jwt');


function saveHabitacion(req, res){
    var habitacionModel = new Habitacion();
    var body = req.body;

    if(body.nameHabitacion && body.Disponibilidad){

        habitacionModel.nameHabitacion = body.nameHabitacion;
        habitacionModel.Disponibilidad = body.Disponibilidad;
        habitacionModel.role = "HABITACION";

    
        habitacionModel.save((err, habitacionGuardada)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion de la Habitacion' });
            if(!habitacionGuardada) return res.status(500).send({ message: 'Error al agregar la habitacion' });
 
            return res.status(200).send({ habitacionGuardada })
        })
    }else{
        return res.status(500).send({message: "Rellene todos los datos necesarios"})
    }
 }  

 function deleteHabitacion(req, res){
    var idHabitacion = req.params.id;

    if(req.use.role != "HOTEL"){
        res.status(403).send({message:"No tienes permisos para esta ruta"});    
    
    }else{
        Habitacion.findByIdAndRemove(idHabitacion,(err,deleted)=>{
            if(err){
                res.status(500).send({message:"Error en el servidor ", err});
            }else if(deleted){
                res.send({message:"Habitacion eliminado exitosamente"});
            }else{
                res.status(404).send({message:"La habitacion que quiere eliminar no existe"});
            }
        });
    }
    
}

function updateHabitacion(req, res){
    var idHabitacion = req.params.id;
    var update = req.body;

    if(req.use.role != "HOTEL"){
        res.status(403).send({message:"Error de permisos para esta ruta"});
    }else{
        Habitacion.findOne({name: update.nameHabitacion}, (err, HabitacionRepeat)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor ", err});
            }else if(HabitacionRepeat){
                res.status(418).send({message:"El nombre de este hotel ya esta registrado"});
            }else{
                Habitacion.findByIdAndUpdate(idHabitacion, update, {new:true},(err,habitacionUpdate)=>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor ", err});
                    }else if(habitacionUpdate){
                        res.send({Habitacion_Actualizado: habitacionUpdate});
                    }else{
                        res.status(404).send({message: "No ha seleccionado un hotel para actualizar"});
                    }
                })
            }
        });
    }
    
}



 module.exports = {
    saveHabitacion,
    deleteHabitacion,
    updateHabitacion
}

