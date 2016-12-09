var express = require('express');
var api = express.Router();

var automatic = require('../controllers/automatic.js');

api.get('/trips', automatic.api.trips);
api.get('/users', automatic.api.users);
api.get('/vehicles', automatic.api.vehicles);
api.get('/vehicle', automatic.api.vehicle);
api.get('/auth', automatic.auth);
api.get('/dashboard', automatic.dashboard);
api.get('/welcome', automatic.welcome);

module.export = api;
