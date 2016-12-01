var request = require('request');

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

automatic.trips = function(req, res, next) {
    request.get({
        uri: "https://api.automatic.com/trip/",
        headers: {
            Authorization: 'Bearer ' + req.session.token.token.access_token
        },
        json: true
    }, function(e, r, body) {
        if (e) {
            next(e);
        } else {
            trip = body.results;
        }

    });
}

automatic.users = function(req, res, next) {
    request.get({
        uri: "https://api.automatic.com/user/me/",
        headers: {
            Authorization: 'Bearer ' + req.session.token.token.access_token
        },
        json: true
    }, function(e, r, body) {
        if (e) {
            next(e);
        } else {
            user = body;
        }
    });
}

automatic.vehicles = function(req, res, next) {
    request.get({
        uri: "https://api.automatic.com/vehicle/1/",
        headers: {
            Authorization: 'Bearer ' + req.session.token.token.access_token
        },
        json: true
    }, function(e, r, body) {
        if (e) {
            next(e);
        } else {
            vehicle = body;
        }
    });
}

automatic.vehicle = function(req, res, next) {
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
        res.send('You are logged in.<br>Access Token: ' + req.session.token.token.access_token + "<br />" + printTrips());
    } else {
        // No token, so redirect to login
        res.redirect('/');
    }
}
// Callback service parsing the authorization token and asking for the access token
automatic.redirect = function(req,res,next){
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
} 

module.exports = automatic;
