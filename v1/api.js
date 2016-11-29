var automatic = require('./automatic');
var verisk = require('./verisk');
var service = require('./service');

var express = require('express');
var api = express.Router();

api.get('/automatic/trips', automatic.trips);
api.get('/automatic/users', automatic.users);
api.get('/automatic/vehicles', automatic.vehicles);

api.get('/verisk', verisk);
api.get('/service', service);

module.exports = api;
