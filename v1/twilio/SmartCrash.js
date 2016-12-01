var http = require('http');
var express = require('express');
var twilio = require('twilio');
var bodyParser = require('body-parser');

var accountSid = 'ACc0eb88b3db3d429fc7aa9c9f8a018d26'; // Your Account SID from www.twilio.com/console
var authToken = '342368f85e36b5174b5cdcb87e98a56e'; // Your Auth Token from www.twilio.com/console

var client = new twilio.RestClient(accountSid, authToken);

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'sassy'
}));

var userProfile = {
    numberOfCustomer: "+14043077465"
};
 

var createMessage = function() {

    var message = {
        body: "Our algorithmn has detected you have been in a wreck. Please respond with a yes if you have been in a wreck, No if you havent, and Emergency if you need our HERO truck to come by",
        to: userProfile.numberOfCustomer, // Text this number
        from: '+14702357839 ' // From a valid Twilio number
    };

    client.messages.create(message, function(err, message) {
        if (err) {
            console.error(err.message);
        } else {

        }
    });

}


app.post('/smartCrashSMS', function(req, res) {
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
