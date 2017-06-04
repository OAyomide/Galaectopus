var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var port = process.env.PORT || 5000; //we set the listening port for the app

//we want to set the port get and set methods. These will handle
//our request and response. i.e E.G app.get('/') serves the
//homepage.. while app.set(port) sets the env port

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
//this req will return 'Hey there! I can code in Node/Express js' Here, we could serve an entire full page (we will get to that)
app.get('/', function(req, res){
    res.send('Hey there! I can code in Node/Express js');
});

//we are setting the url path for the webhook. Facebook needs this, so pay attention (or really dont)
app.get('/webhook/', function(req, res){
    //this line simply means when body-parser parses the page,
    //and the request query has a 'field' which is opsidian_verify then do bla bla bla
    //whicb in this case is send back some strings
    if(req.query['hub.verify_token']==='opsidian_verify'){
        res.send(req.query['hub.challenge'])
    }
    res.send('This is a sacred page. You have no access here');
})

//we fire up our server so we can finall see stuffs happen
app.listen(port, function(){
    console.log('Sweet app up and running at port: ', port);
})

//we have handled the get requests, we are now going handle
//post requests (Really, If you are readinf this I dont need to explain
//post and get requests again. I dont even need to comment at all)

//we are POSTing to the /webhook url. The same could be done when handling form handling in expressjs
app.post('/webhook', function(req, res){
    var stuffs = req.body;

    //we make sure we are dealing with a page subscription here
    if(stuffs.object === 'page'){
        //we are looping over each entry
        stuffs.entry.forEach(function(entry){
            //we are setting variables for each property
            //of entry. You get the gist I bet
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            entry.messaging.forEach(function(event){
                if(event.message){
                    //what this does is that it the event is a message, fire up this function
                    //this is extremely useful when the user messages our bot
                    //we will declare this function later
                    //in the future, probably in another file, then we export it.
                    receivedMessage(event)
                };
            });
        });
    };
});

//we will believe its a green, hence send a server status of 200 (means all is well);
res.sendStatus(200);

function receivedMessage(event){
    var senderID = event.sender.id;
    var timeOfMessage = event.timestamp;
    var recipientID = event.recipient.id;
    var message = event.message;

    //we simply log to console so we can be rest-assured and keep track on stuffs
    console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));


  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;
}

if (messageText) {
    switch(messageText){
        case 'Buttons':
            quickButtons(senderID);
            break;
        case 'hello':
            sendTextMessage(senderID,"Hello there!")
            break;
        default:
            senderTextMessage(senderID,messageText)
            }
       callsendAPI(messageData)
       }
       
       
      function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}
