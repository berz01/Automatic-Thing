var http = require('http');
var express = require('express');
var twilio = require('twilio');
var bodyParser = require('body-parser');

var accountSid = 'ACc0eb88b3db3d429fc7aa9c9f8a018d26'; // Your Account SID from www.twilio.com/console
var authToken = '342368f85e36b5174b5cdcb87e98a56e'; // Your Auth Token from www.twilio.com/console

var twilioClient = new twilio.RestClient(accountSid, authToken);
var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'sassy'
}));

// Dummy Data, should coem from another service, including twilioClient
var serverSMS = {
    serverNumber: '+14702357839',
    defaultCrashMessage: "Our algorithmn has detected you have been in a wreck. Please respond with a yes if you have been in a wreck, No if you havent, and Emergency if you need our HERO truck to come by";
}
var userProfile = {
    numberOfCustomer: "+14043077465"
};


var sendServerSMS = function(number, message)
    var message = {
        body: messasge,
        to: userProfile.numberOfCustomer, // Text this number
        from:  serverSMS.serverNumber     // outgoing number - set in twilio dashboard TODO: see if we can pull from the twilio.RestClient
    };

    twilioClient.messages.create(message, function(err, message) {
            console.error(err.message);
    });

}

app.post('https://handler.twilio.com/twiml/EHd2ef0fef33d24ffdaf4f5e427477c0cd', function(req, res) {
    //Validate that this request really came from Twilio...
    if (twilio.validateExpressRequest(req, 'YOUR_AUTH_TOKEN')) {
        var twiml = new twilio.TwimlResponse();

        res.type('text/xml');
        res.send(twiml.toString());
    } else {
        res.send('you are not twilio.  Buzz off.');
    }
});

app.post('/sms2', function(req, res) {
    var twiml = new twilio.TwimlResponse();
    twiml.message('The Robots are coming! Head for the hills!');
    res.writeHead(200, {
        'Content-Type': 'text/xml'
    });
    res.end(twiml.toString());
});

app.post('/sms', function(req, res) {
    var twiml = new twilio.TwimlResponse();

    if (req.body.Body == 'Yes' && req.body.Body == 'yes') {
        twiml.message('We have pre-populated a claim for you. Please follow this link to complete: http://www.claims.com/12345');
    } else if (req.body.Body == 'No') {
        twiml.message('We apologize for texting you, but we wanted to make sure you werent in an accident');
    } else if (req.body.Body == 'Emergency') {
        twiml.message('We apologize for texting you, but we wanted to make sure you werent in an accident');

    } else {
        twiml.message('We do not recognize your response, please say Yes, No, or Emergency');
    }
    res.writeHead(200, {
        'Content-Type': 'text/xml'
    });
    res.end(twiml.toString());
});

app.post('/sms', function(req, res) {
    var smsCount = req.session.counter || 0;

    var message = 'Hello, thanks for the new message.';
    if (smsCount > 0) {
        message = 'Hello, thanks for message number ' + (smsCount + 1);
    }

    req.session.counter = smsCount + 1;

    var twiml = new twilio.TwimlResponse();
    twiml.message(message);
    res.writeHead(200, {
        'Content-Type': 'text/xml'
    });
    res.end(twiml.toString());
});

app.post('/api/users', function(req, res) {
    var user_id = req.body.id;
    var token = req.body.token;
    var geo = req.body.geo;

    res.send(user_id + ' ' + token + ' ' + geo);
});

http.createServer(app).listen(1337, function() {
    console.log("Express server listening on port 1337");
});
