
var rp = require('request-promise');
var express = require('express');
var api = express.Router();

api.use('/automatic/*', require('./routes/automatic.js'));
api.use('/smartsms/*', require('./routes/smartcrash.js'));
// api.get('/verisk', verisk);
// api.get('/service', service);

module.exports = api;
