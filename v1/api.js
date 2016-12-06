var automatic = require('./automatic');
var verisk = require('./verisk');
var service = require('./service');
var rp = require('request-promise');

var express = require('express');
var api = express.Router();

var promiseWrapper = function(automaticPromise){
  automaticPromise.then()

}

api.get('/automatic/trips', automatic.api.trips);
api.get('/automatic/users', automatic.api.users);
api.get('/automatic/vehicles', automatic.api.vehicles);
api.get('/automatic/vehicle', automatic.api.vehicle);
api.get('/automatic/auth', automatic.auth);
api.get('/automatic/dashboard', automatic.dashboard);
api.get('/automatic/welcome', automatic.welcome);
// api.get('/verisk', verisk);
// api.get('/service', service);

api.use('/automatic/*')

module.exports = api;
