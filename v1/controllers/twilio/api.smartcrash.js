
var twilio = require('twilio');

var accountSid = 'ACc0eb88b3db3d429fc7aa9c9f8a018d26'; // Your Account SID from www.twilio.com/console
var authToken = '342368f85e36b5174b5cdcb87e98a56e'; // Your Auth Token from www.twilio.com/console
var smartcrash = require('./module.smartcrash');
var twilioClient = new twilio.RestClient(accountSid, authToken);
var defaultCrashMessage = "Our algorithmn has detected you have been in a wreck. Please respond with a Yes if you have been in a wreck, No if you havent, or Emergency";

var clientSms = {
    numberOfCustomer: "+14043077465"
};

exports.testSms = function(req, res){
  var twiml = new twilio.TwimlResponse();
  twiml.message('The Robots are coming! Head for the hills!');
  res.writeHead(200, {
      'Content-Type': 'text/xml'
  });

  req.session.counter = smsCount++;
  console.log(smsCount);

  res.end(twiml.toString());
}

exports.incomingSms = function(req, res) {
    smartcrash.sendSms(clientSms.numberOfCustomer, smartcrash.crashResponse(req.body.Body));
};


// exports.sendSmsTwiml = function(req, res) {
//     var twiml = new twilio.TwimlResponse();
//     twiml.message(clientSms.numberOfCustomer, smartcrash.crashResponse(req.body.Body));
//     res.writeHead(200, {
//         'Content-Type': 'text/xml'
//     });
//     res.end(twiml.toString());
// };


exports.crashDetection = function(req, res){
    if(req.body.crash){
      clientSms.numberOfCustomer = req.body.number != null ? req.body.number : clientSms.numberOfCustomer;
      smartcrash.sendSms(clientSms.numberOfCustomer, defaultCrashMessage);
      return res.send('Successful');
    } else {
      console.log(req.body);
      return res.send('Failure:');
    }
};

exports.getUsers = smartcrash.getUsers;
