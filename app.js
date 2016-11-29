// External frameworks and dependencies
const request = require('request');
const express = require('express');
const session = require('express-session');
var https = require('https');

// Internal Api's
const api = require('./v1/api');
const SmartCrash = require('./v1/api');
// Server settings
const port = process.env.PORT || 8080;
const app = express();


app.set('view engine', 'ejs');

// hooking up Twilio
var accountSid = 'ACc0eb88b3db3d429fc7aa9c9f8a018d26'; // Your Account SID from www.twilio.com/console
var authToken = '342368f85e36b5174b5cdcb87e98a56e'; // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);
 
app.post('https://handler.twilio.com/twiml/EHd2ef0fef33d24ffdaf4f5e427477c0cd', function(req, res) {
    //Validate that this request really came from Twilio...
    if (twilio.validateExpressRequest(req, 'YOUR_AUTH_TOKEN')) {
        var twiml = new twilio.TwimlResponse();
        // client.messages.create({
        //     body: 'You have been messaged by Car2claim',
        //     to: '+14043077465',  // Text this number
        //     from: '+14702357839 ' // From a valid Twilio number
        //   }, function(err, message) {
        //       if(err) {
        //           console.error(err.message);
        //       }
        //   });
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

// Add your automatic client id and client secret here or as environment variables
const AUTOMATIC_CLIENT_ID = process.env.AUTOMATIC_CLIENT_ID || '2ee3c7c2f4b652fc1ee1';
const AUTOMATIC_CLIENT_SECRET = process.env.AUTOMATIC_CLIENT_SECRET || 'ba1590bcd38c31a310d79726e6be9a89d383aa69';

const oauth2 = require('simple-oauth2')({
    clientID: AUTOMATIC_CLIENT_ID,
    clientSecret: AUTOMATIC_CLIENT_SECRET,
    site: 'https://accounts.automatic.com',
    tokenPath: '/oauth/access_token'
});

// Authorization uri definition
const authorizationUri = oauth2.authCode.authorizeURL({
    scope: 'scope:user:profile scope:trip scope:location scope:vehicle:profile scope:vehicle:events scope:behavior'
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

// Initial page redirecting to Automatic's oAuth page
app.get('/auth', (req, res) => {
    res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/redirect', (req, res) => {
    const code = req.query.code;

    function saveToken(error, result) {
        if (error) {
            console.log('Access token error', error.message);
            res.send('Access token error: ' + error.message);
            return;
        }

        // Attach `token` to the user's session for later use
        // This is where you could save the `token` to a database for later use
        req.session.token = oauth2.accessToken.create(result);

        request.get({
            uri: "https://api.automatic.com/trip/",
            headers: {
                Authorization: 'Bearer ' + req.session.token.token.access_token
            },
            json: true
        }, function(e, r, body) {
            if (e) {} else {
                trips = body.results;
            }
            res.redirect('/trips');
        });
    }

    oauth2.authCode.getToken({
        code: code
    }, saveToken);
});

app.get('/welcome', (req, res) => {
    if (req.session.token) {
        // Display token to authenticated user
        console.log('Automatic access token', req.session.token.token.access_token);
        res.send('You are logged in.<br>Access Token: ' + req.session.token.token.access_token + "<br />" + printTrips());
    } else {
        // No token, so redirect to login
        res.redirect('/');
    }
});

app.get('/dashboard', function(req, res) {
    console.log("/dashboard");

    res.render('dashboard-new', {});
});

// Main page of app with link to log in
app.get('/', (req, res) => {
    res.send('<div><img src="http://i.imgur.com/3U6rueQ.jpg" alt="Smiley face"></div><h1><a href="/auth">Log in with Automatic</a></h1>');
});

// ------------- New API -----------------
app.get('/api/v1/*', function(req, res, next) {
    console.log("Hit Auth Filter For Access");
    next();
});

app.get('/api/v1/', function(req, res, next) {
    console.log("Hit Auth Request");
    next();
});

app.get('/api/v1/trips', function(res, req, next) {
    api.trips(req, res, next);
});
app.get('/api/v1/users', function(res, req, next) {
    api.users(req, res, next);
});
app.get('/api/v1/vehicles', function(res, req, next) {
    api.vehicles(req, res, next);
});

app.get('/api/v1/sms', function(res, req, next){

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
app.listen(port);

console.log('Express server started on port ' + port);
