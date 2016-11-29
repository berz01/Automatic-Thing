var accountSid = 'ACc0eb88b3db3d429fc7aa9c9f8a018d26'; // Your Account SID from www.twilio.com/console
var authToken = '342368f85e36b5174b5cdcb87e98a56e';   // Your Auth Token from www.twilio.com/console

var client = require('twilio')(accountSid, authToken);

client.messages.list(function(err, data) {
        console.log("this is the SID " + data.messages[0].sid);
      //  var messageDataArray = message[0];

      //  console.log("from array" + messageDataArray);s
});
