'use strict'

var userController = require("../controllers/user.controller");
var authentication = require("../middleware/autenticathed");
var express = require('express');
var api = express.Router();

api.post('/saveUser', userController.saveUser);
api.put('/updateUser/:id', authentication.ensureAuth,userController.updateUser);
api.delete('/deleteUser/:id', authentication.ensureAuth,userController.deleteUser);
api.get('/listUsers', authentication.ensureAuthAdmin, userController.listUser);
module.exports = api;