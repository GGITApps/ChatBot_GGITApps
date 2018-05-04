var express = require("express")

var bodyParser = require("body-parser")

var request = require("request")

const appkey= process.env.KEY || "EAABvEfABmhwBAPfzX17H5McD6l3ZAYm7K0yDCpGo738IPDdDDbfHvYMZCIkfwHKgrN5nkgNZBsAW3pTQA4pNPjYDiZBblxamQprkhbwNoiZCzPpmQv2iRZCwu97WU0d9SML2XHSItQEBh85khKq4w8vWVIPRvXtlKSYpb68RmOsAZDZD"
const port = process.env.PORT || 3000

var app = express()
app.use(bodyParser.json())

app.listen(port , ()=>{
  console.log("El server esta corriendo en el puerto 3000")
})

app.get("/", (req, res)=>{
    res.send("Bienvenido a el GET ")
})

app.get("/webhook", (req, res)=>{
    if(req.query['hub.verify_token']=== 'test_token_say_hello'){
      res.send(req.query['hub.challenge'])
    }else{
      res.send("No deberias estar aquí")
    }


})

app.post("/webhook", (req, res)=>{
    var data = req.body
    if(data.object = "page"){
      data.entry.forEach((pageEntry)=>{
        pageEntry.messaging.forEach((messagingEvent)=>{
          recieveMessaging(messagingEvent)
        })

      })
      res.sendStatus(200)
    }
})

function  recieveMessaging(event)
{
  var senderID=event.sender.Id
  var messageText = event.message.text
  console.log(messageText)


  evaluateMessage(messageText)
}
function evaluateMessage(message){

}
