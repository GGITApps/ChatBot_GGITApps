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

app.post('/webhook', function(req, res){

	var data = req.body;
	if(data.object == 'page'){

		data.entry.forEach(function(pageEntry){
			pageEntry.messaging.forEach(function(messagingEvent){

				if(messagingEvent.message){
					receiveMessage(messagingEvent);
				}

			});
		});
		res.sendStatus(200);
	}
});


function receiveMessage(event){
	var senderID = event.sender.id;
	var messageText = event.message.text;


	evaluateMessage(senderID, messageText);
}

function evaluateMessage(recipientId ,message){
	var finalMessage = '';

	if(isContain(message, 'ayuda')){
		finalMessage = 'Por el momento no te puedo ayudar';

	}else if(isContain(message, 'gato')){

	 sendMessageImage(recipientId);

	}else if(isContain(message, 'clima')){

		getWeather(function(temperature){

			message = getMessageWeather(temperature);
			sendMessageText(recipientId,message);

		});

	}else if(isContain(message, 'info')){

	 sendMessageTemplate(recipientId);

	}else{
		finalMessage = 'solo se repetir las cosas : ' + message;
	}
	sendMessageText(recipientId,finalMessage);
}

function sendMessageText(recipientId, message){
	var messageData = {
		recipient : {
			id : recipientId
		},
		message: {
			text: message
		}
	};
	callSendAPI(messageData);
}

function sendMessageImage(recipientId){
	var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: "http://i.imgur.com/SOFXhd6.jpg"
        }
      }
    }
  };
	callSendAPI(messageData);
}


function sendMessageTemplate(recipientId){
	var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [ elemenTemplate() ]
        }
      }
    }
  };
	callSendAPI(messageData);
}

function elemenTemplate(){
	return {
	  title: "Eduardo Ismael",
	  subtitle: "Desarrollado de Software en Código facilito",
	  item_url: "https://www.facebook.com/codigofacilito/?fref=ts",
	  image_url: "http://i.imgur.com/SOFXhd6.jpg",
	  buttons: [ buttonTemplate() ],
  }
}

function buttonTemplate(){
	return{
		type: "web_url",
		url : "https://www.facebook.com/codigofacilito/?fref=ts",
		title : "Codigo Facilito"
	}
}

function callSendAPI(messageData){
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs : { access_token :  appkey },
		method: 'POST',
		json: messageData
	}, function(error, response, data){

		if(error){
			console.log('No es posible enviar el mensaje');
		}else{
			console.log("El mensaje fue enviado");
		}

	});
}

function getMessageWeather(temperature){
	if (temperature > 30)
		return "Nos encontramos a "+ temperature +" Hay demaciado calor, te recomiendo que no salgas";
	return "Nos encontramos a "+ temperature +" es un bonito día para salir";
}

function getWeather(  callback ){
	request('http://api.geonames.org/findNearByWeatherJSON?lat=16.750000&lng=-93.116669&username=demo',
		function(error, response, data){
			if(!error){
				var response = JSON.parse(data);
				var temperature = response.weatherObservation.temperature;
				callback(temperature);
			}
		});
}

function isContain(sentence, word){
	return sentence.indexOf(word) > -1;
}
