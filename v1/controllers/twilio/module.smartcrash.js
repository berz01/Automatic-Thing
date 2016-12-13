var twilio = require('twilio');
var accountSid = 'ACc0eb88b3db3d429fc7aa9c9f8a018d26'; // Your Account SID from www.twilio.com/console
var authToken = '342368f85e36b5174b5cdcb87e98a56e'; // Your Auth Token from www.twilio.com/console

// Send using twilito rest client
var twilioClient = new twilio.RestClient(accountSid, authToken);

// Dummy Data, should coem from another service, including twilioClient
var serverSMS = {
    serverNumber: '+14702357839',
    defaultCrashMessage: "Our algorithmn has detected you have been in a wreck. Please respond with a yes if you have been in a wreck, No if you havent, and Emergency if you need our HERO truck to come by"
};

var userProfile = {
    numberOfCustomer: "+18502284585"
};

var smartcrash = smartcrash || { };

smartcrash.sendSms = function(number, message) {
    var message = {
        body: messasge,
        to: userProfile.numberOfCustomer, // Text this number
        from: serverSMS.serverNumber // outgoing number - set in twilio dashboard TODO: see if we can pull from the twilio.RestClient
    };

    twilioClient.messages.create(message, function(err, message) {
        console.error(err.message);
    });
}

smartcrash.getUsers = function(req, res) {
    var user_id = req.body.id;
    var token = req.body.token;
    var geo = req.body.geo;

    res.send(user_id + ' ' + token + ' ' + geo);
};

smartcrash.crashResponse = function(message){
  var received = message.toString().toLowerCase();
  var sms_response = "We do not recognize your response, please say Yes, No, or Emergency";

  switch (received) {
      case "yes":
          sms_response = 'We have pre-populated a claim for you. Please follow this link to complete: http://www.claims.com/12345';
          break;
      case "no":
          sms_response = 'We apologize for texting you, but we wanted to make sure you werent in an accident';
          break;
      case "emergency":
          sms_response = "GET OUT NOW RUN";
          break;
  }

  return sms_response;
};

module.exports = smartcrash;
