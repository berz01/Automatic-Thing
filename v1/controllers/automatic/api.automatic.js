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


// Add your automatic client id and client secret here or as environment variables
const AUTOMATIC_CLIENT_ID = process.env.AUTOMATIC_CLIENT_ID || '2ee3c7c2f4b652fc1ee1';
const AUTOMATIC_CLIENT_SECRET = process.env.AUTOMATIC_CLIENT_SECRET || 'ba1590bcd38c31a310d79726e6be9a89d383aa69';

const oauth2 = require('simple-oauth2')({
    clientID: AUTOMATIC_CLIENT_ID,
    clientSecret: AUTOMATIC_CLIENT_SECRET,
    site: 'https://accounts.automatic.com',
    tokenPath: '/oauth/access_token'
});


const automatic = require('./module.automatic.js');

// Authorization uri definition
const authorizationUri = oauth2.authCode.authorizeURL({
    scope: 'scope:user:profile scope:trip scope:location scope:vehicle:profile scope:vehicle:events scope:behavior'
});

exports.trips = function(req, res){
  automatic.trips(req)
    .then(function(result){
    res.send(result);
  });
}

exports.users = function(req, res){
  automatic.users(req)
    .then(function(result){
    res.send(result);
  });
}

exports.vehicles = function(req, res){
  automatic.vehicles(req)
    .then(function(result){
    res.send(result);
  });
}

exports.vehicle = function(req, res){
  automatic.vehicle(eq)
    .then(function(result){
    res.send(result);
  });
}

// Initial page redirecting to Automatic's oAuth page
exports.auth = function(req, res, next){
    res.redirect(authorizationUri);
}

exports.dashboard = function(req, res) {
    console.log("/dashboard");
    res.render('dashboard-new', {});
}


exports.welcome = function(req, res) {
    if (req.session.token) {
        // Display token to authenticated user
        console.log('Automatic access token', req.session.token.token.access_token);
        return res.send('You are logged in.<br>Access Token: ' + req.session.token.token.access_token + "<br />" + printTrips());
    } else {
        // No token, so redirect to login
        return res.redirect('/');
    }
}
