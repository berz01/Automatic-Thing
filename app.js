// External frameworks and dependencies
const request = require('request');
const express = require('express');
const session = require('express-session');
var https = require('https');

// Server settings
const port = process.env.PORT || 8080;
const app = express();

 // Setting view engine
app.set('view engine', 'ejs');

// hooking up Twilio
var accountSid = 'ACc0eb88b3db3d429fc7aa9c9f8a018d26'; // Your Account SID from www.twilio.com/console
var authToken = '342368f85e36b5174b5cdcb87e98a56e'; // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);


// New API

app.use('/api/v1', require("./v1/api"));

app.get('/api/v1/*', function(req, res, next) {
    console.log("Hit Auth Filter For Access");
    next();
});
  
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

app.post('/sms', function(req, res) {
    var twiml = new twilio.TwimlResponse();
    twiml.message('The Robots are coming! Head for the hills!');
    res.writeHead(200, {
        'Content-Type': 'text/xml'
    });
    res.end(twiml.toString());
});


// Local caching
var trips;
var vehicle;
var user;

// Printing trips from api
function printTrips() {
    var tripIds = "";

    for (var i = trips.length - 1; i >= 0; i--) {
        tripIds += trips[i].id;
    }

    return tripIds;
}


// Enable sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));


// Main page of app with link to log in
app.get('/', (req, res) => {
    res.send('<div><img src="http://i.imgur.com/3U6rueQ.jpg" alt="Smiley face"></div><h1><a href="/auth">Log in with Automatic</a></h1>');
});

// ------------- Old API -----------------
app.get('/trips', function(req, res) {
    console.log("/trips");

    for (var i = 0; i < trips.length; i++) {
        if (i % 2 == 0) {
            trips[i].ignition_on = 0;
            trips[i].ignition_off = -1;
        } else {
            trips[i].ignition_off = 1;
            trips[i].ignition_on = -1;
        }


        if (Math.floor(Math.random() * 20) > 15) {
            trips[i].engine_temperature = Math.floor(Math.random() * 17) + 500;
        } else {
            trips[i].engine_temperature = Math.floor(Math.random() * 17) + 200;
        }
    }

    res.render('trips', {
        trips: trips
    });
});

app.get('/claims', function(req, res) {
    console.log("/claims");
    request.get({
      uri
    });
    request.get({
        uri: "https://api.automatic.com/user/me/",
        headers: {
            Authorization: 'Bearer ' + req.session.token.token.access_token
        },
        json: true
    }, function(e, r, body) {
        if (e) {} else {
            user = body;

            request.get({
                uri: "https://api.automatic.com/vehicle/",
                headers: {
                    Authorization: 'Bearer ' + req.session.token.token.access_token
                },
                json: true
            }, function(e, r, body) {
                if (e) {} else {
                    vehicle = body.results[0];
                }
            });

            res.render('claims', {
                trips: trips,
                vehicle: vehicle,
                user: user
            });

        }
    });
});

app.get('/claims2', function(req, res) {
    console.log("/claims2");

    request.get({
        uri: "https://api.automatic.com/user/me/",
        headers: {
            Authorization: 'Bearer ' + req.session.token.token.access_token
        },
        json: true
    }, function(e, r, body) {
        if (e) {} else {
            user = body;

            request.get({
                uri: "https://api.automatic.com/vehicle/",
                headers: {
                    Authorization: 'Bearer ' + req.session.token.token.access_token
                },
                json: true
            }, function(e, r, body) {
                if (e) {} else {
                    vehicle = body.results[0];
                }
            });

            res.render('claims2', {
                trips: trips,
                vehicle: vehicle,
                user: user
            });

        }
    });
});

app.get('/claims3', function(req, res) {
    console.log("/claims3");

    request.get({
        uri: "https://api.automatic.com/user/me/",
        headers: {
            Authorization: 'Bearer ' + req.session.token.token.access_token
        },
        json: true
    }, function(e, r, body) {
        if (e) {} else {
            user = body;

            request.get({
                uri: "https://api.automatic.com/vehicle/",
                headers: {
                    Authorization: 'Bearer ' + req.session.token.token.access_token
                },
                json: true
            }, function(e, r, body) {
                if (e) {} else {
                    vehicle = body.results[0];
                }
            });

            res.render('claims3', {
                trips: trips,
                vehicle: vehicle,
                user: user
            });

        }
    });
});

app.get('/claims', function(req, res) {
    console.log("/claims");

    request.get({
        uri: "https://api.automatic.com/user/me/",
        headers: {
            Authorization: 'Bearer ' + req.session.token.token.access_token
        },
        json: true
    }, function(e, r, body) {
        if (e) {} else {
            user = body;

            request.get({
                uri: "https://api.automatic.com/vehicle/",
                headers: {
                    Authorization: 'Bearer ' + req.session.token.token.access_token
                },
                json: true
            }, function(e, r, body) {
                if (e) {} else {
                    vehicle = body.results[0];
                }
            });

            res.render('claims', {
                trips: trips,
                vehicle: vehicle,
                user: user
            });

        }
    });
});

app.get('/claims4', function(req, res) {
    console.log("/claims4");

    res.render('claims4', {
        trips: trips,
        vehicle: vehicle,
        user: user
    });
});

// Start server
var appPages = app.listen(port, function () {
    console.log("\nappPages now running on port", appPages.address().port);
});
