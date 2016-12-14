
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var session = require('express-session');
var api = express.Router();

var smartcrashApi = require('../controllers/twilio/api.smartcrash.js');

api.use(bodyParser.json()); // support json encoded bodies
api.use(bodyParser.urlencoded({
    extended: true
}));

api.use(session({
    secret: 'sassy'
}));

api.post("/crash/:status", smartcrashApi.crashDetection);
api.post("/crash", smartcrashApi.crashDetection);
api.post("/sms", smartcrashApi.incomingSms);
api.get("/test", smartcrashApi.testSms);
// api.post("/users", smartcrash.getUsers);


api.post('https://handler.twilio.com/twiml/EHd2ef0fef33d24ffdaf4f5e427477c0cd', function(req, res) {
    //Validate that this request really came from Twilio...
    if (twilio.validateExpressRequest(req, 'YOUR_AUTH_TOKEN')) {
        var twiml = new twilio.TwimlResponse();
        res.type('text/xml');
        res.send(twiml.toString());
    } else {
        res.send('you are not twilio.  Buzz off.');
    }
});

module.exports = api;
