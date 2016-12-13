var rp = require('request-promise');

var automatic = automatic || {
  api: {}
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

module.exports = automatic;
