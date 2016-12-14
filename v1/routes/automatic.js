var autoapi = require('../controllers/automatic/api.automatic.js');
var express = require('express');

var api = express.Router();

api.get('/trips', autoapi.trips);
api.get('/users', autoapi.users);
api.get('/vehicles', autoapi.vehicles);
api.get('/vehicle', autoapi.vehicle);
api.get('/auth', autoapi.auth);
api.get('/dashboard', autoapi.dashboard);
api.get('/welcome', autoapi.welcome);

module.exports = api;
