var express = require("express")

var bodyParser = require("body-parser")

var request = require("request")


var app = express()
app.use(bodyParser.json())

app.listen(3000, ()=>{
  console.log("El server esta corriendo en el puerto 3000")
})

app.get("/", (req, res)=>{
    res.send("Bienvenido a el GET ")
})
