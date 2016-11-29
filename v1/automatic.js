var request = require('request');

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

automatic.sms = function(req, res, next){

}

module.exports = automatic;
