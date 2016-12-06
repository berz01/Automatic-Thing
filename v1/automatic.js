/**
 *
 * @author
 * Taylor Ereio and Barrett Davis
 *
 * @file
 * Provides REST API calls for Autmoatic using promises
 *

 * Framework References
 * bluebird - http://bluebirdjs.com/docs/getting-started.html
 * Request-Promise - https://github.com/request/request-promise/
 */
var rp = require('request-promise');

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

var automatic = automatic || {

};

automatic.trips = function(req) {
    // return body.results;
    return rp.get({
        uri: "https://api.automatic.com/trip/",
        headers: {
            Authorization: 'Bearer ' + req.session.token.token.access_token
        },
        json: true
    });
}

automatic.users = function(req) {
    // user = body;

    return rp.get({
        uri: "https://api.automatic.com/user/me/",
        headers: {
            Authorization: 'Bearer ' + req.session.token.token.access_token
        },
        json: true
    });
}

automatic.vehicles = function(req) {
    // vehicle = body;

    return rp.get({
        uri: "https://api.automatic.com/vehicle/1/",
        headers: {
            Authorization: 'Bearer ' + req.session.token.token.access_token
        },
        json: true
    });
}

automatic.vehicle = function(req) {
    // vehicle = body.results[0];

    return rp.get({
        uri: "https://api.automatic.com/vehicle/",
        headers: {
            Authorization: 'Bearer ' + req.session.token.token.access_token
        },
        json: true
    });
}

automatic.api.trips = function(){
  automatic.trips()
    .then(function(result){
    res.send(result);
  });
}

automatic.api.users = function(){
  automatic.trips()
    .then(function(result){
    res.send(result);
  });
}

automatic.api.vehicles = function(){
  automatic.trips()
    .then(function(result){
    res.send(result);
  });
}

automatic.api.vehicle = function(){
  automatic.trips()
    .then(function(result){
    res.send(result);
  });
}

// Initial page redirecting to Automatic's oAuth page
automatic.auth = function(req, res, next){
    res.redirect(authorizationUri);
}

automatic.dashboard = function(req, res) {
    console.log("/dashboard");
    res.render('dashboard-new', {});
}


automatic.welcome = function(req, res) {
    if (req.session.token) {
        // Display token to authenticated user
        console.log('Automatic access token', req.session.token.token.access_token);
        return res.send('You are logged in.<br>Access Token: ' + req.session.token.token.access_token + "<br />" + printTrips());
    } else {
        // No token, so redirect to login
        return res.redirect('/');
    }
}

module.exports = automatic;
