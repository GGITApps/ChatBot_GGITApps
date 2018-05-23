var express = require("express")

var bodyParser = require("body-parser")

var request = require("request")

const appkey= process.env.KEY
const port = process.env.PORT

var app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.listen(port , ()=>{
  console.log("El server esta corriendo en el puerto 3000")
})

app.get("/", (req, res)=>{
    res.send("Bienvenido a el GET ")
})

app.get("/.well-known/acme-challenge/NZYDiaPHFDZ18ecrnPYMrjNmUmmg8p9BypKD4Bq0b_c", (req,res)=>{
	res.send("NZYDiaPHFDZ18ecrnPYMrjNmUmmg8p9BypKD4Bq0b_c.t9HdmWtLDRzVcySOcqaWesEBErfXXtZK44E7R3e1ywA")
})

app.get("/webhook", (req, res)=>{
    if(req.query['hub.verify_token']=== process.env.VERTOKEN){
      console.log("Realizado el webhook")
      res.send(req.query['hub.challenge'])
    }else{
      res.send("No deberias estar aquí")
      res.sendStatus(403);
    }


})

// Callbacks
app.post("/webhook", function (req, res) {
  // Make sure this is a page subscription
  if (req.body.object == "page") {
    // Iterate over each entry
    // There may be multiple entries if batched
    req.body.entry.forEach(function(entry) {
      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.postback) {
          processPostback(event);
        }
      });
    });

    res.sendStatus(200);
  }
});

function processPostback(event) {
  var senderId = event.sender.id;
  var payload = event.postback.payload;

  if (payload === "Greeting") {
    // Get user's first name from the User Profile API
    // and include it in the greeting
    request({
      url: "https://graph.facebook.com/v2.6/" + senderId,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        name = bodyObj.first_name;
        greeting = "Hi " + name + ". ";
      }
      var message = greeting + "Estamos bajo pruebas en nuestro bot, visitanos mas tarde 😄";
      sendMessage(senderId, {text: message});
    });
  }
}

// sends message to user
function sendMessage(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: message,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}
