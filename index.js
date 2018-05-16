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

  console.log("-----------------------")
  console.log(senderID)
  console.log(messageText)
  console.log("-----------------------")

  evaluateMessage(messageText)
}
function evaluateMessage(message){

}
