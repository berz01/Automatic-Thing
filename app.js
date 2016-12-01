// External frameworks and dependencies
const request = require('request');
const express = require('express');
const session = require('express-session');
const Promise = require('bluebird');
const https = require('https');
const autoapi = require('./v1/automatic')

// Server settings
const port = process.env.PORT || 8080;
const app = express();

// Setting view engine
app.set('view engine', 'ejs');

// New API
app.use('/api/v1', require("./v1/api"));

app.get('/api/v1/*', function(req, res, next) {
    console.log("Hit Auth Filter For Access");
    next();
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

function modTrips(trips){
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

  return trips;
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

// ------------- Old API -----------------
app.get('/trips', function(req, res) {
    console.log("/trips");

    trips = modTrips(trips);

    res.render('trips', {
        trips: trips
    });
});

app.get('/claims', function(req, res) {
    console.log("/claims");

    var parallel = function(req) {
        return Promise.all([autoapi.users(req), autoapi.vehicle(req)])
    }

    parallel(req)
        .spread(function(user, vehicle) {
            res.render('claims', {
                trips: trips,
                vehicle: vehicle.results[0],
                user: user
            })
        })
        .catch(function(err)) {
            console.log(err);
        };

});

app.get('/claims2', function(req, res) {
    console.log("/claims2");

    var parallel = function(req) {
        return Promise.all([autoapi.users(req), autoapi.vehicle(req)])
    }

    parallel(req)
        .spread(function(user, vehicle) {
            res.render('claims', {
                trips: trips,
                vehicle: vehicle.results[0],
                user: user
            })
        })
        .catch(function(err)) {
            console.log(err);
        };
});

app.get('/claims3', function(req, res) {
    console.log("/claims3");

    var parallel = function(req) {
        return Promise.all([autoapi.users(req), autoapi.vehicle(req)])
    }

    parallel(req)
        .spread(function(user, vehicle) {
            res.render('claims', {
                trips: trips,
                vehicle: vehicle.results[0],
                user: user
            })
        })
        .catch(function(err)) {
            console.log(err);
        };
});

app.get('/claims', function(req, res) {
    console.log("/claims");

    var parallel = function(req) {
        return Promise.all([autoapi.users(req), autoapi.vehicle(req)])
    }

    parallel(req)
        .spread(function(user, vehicle) {
            res.render('claims', {
                trips: trips,
                vehicle: vehicle.results[0],
                user: user
            })
        })
        .catch(function(err)) {
            console.log(err);
        };
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
var appPages = app.listen(port, function() {
    console.log("\nappPages now running on port", appPages.address().port);
});
