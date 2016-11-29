var http = require('http'),
    express = require('express'),
    session = require('express-session'),
    twilio = require('twilio');

var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(session({ secret: 'sassy' }));

app.post('/sms', function(req, res) {
  var smsCount = req.session.counter || 0;

  var message = 'Hello, thanks for the new message.';
  if(smsCount > 0) {
    message = 'Hello, thanks for message number ' + (smsCount + 1);
  }

  req.session.counter = smsCount + 1;

  var twiml = new twilio.TwimlResponse();
  twiml.message(message);
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

app.post('/api/users', function(req, res) {
    var user_id = req.body.id;
    var token = req.body.token;
    var geo = req.body.geo;

    res.send(user_id + ' ' + token + ' ' + geo);
});

http.createServer(app).listen(1337, function () {
  console.log("Express server listening on port 1337");
});
