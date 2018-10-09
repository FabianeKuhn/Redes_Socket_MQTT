var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
//Indica a utilização do socket.io
var io = require('socket.io')(http);
const mqtt    = require("mqtt");
var clientMqtt    = mqtt.connect('mqtt:iot.eclipse.org:1883');

//Apresenta o diretório dist para o uso do webpack, que se tornou necessário pelo fato do FusionCharts
//não ser compatível com o ES6
app.use(express.static('./dist'));

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

//------------------------------------------------------------->>Mqtt 
clientMqtt.subscribe("s8dDeVa8ap/redes/trabalhoGA", { qos: 1 }, function(err, granted) {
  if (err)
    console.log(err);
  else
  {
    console.log("clientMqtt connected : ", granted);
  }
});

//Conexão do socket
io.on('connection', function (socket) {
  clientMqtt.on('message', function(topic, message) { 
    var temperatura = JSON.parse(message.toString());
 
    if(topic == "s8dDeVa8ap/redes/trabalhoGA"){ 
      var x = new Date();
//Formata a hora da medida
      var formatted =  (x.getHours()) + ':' + (x.getMinutes()) + ':' + (x.getSeconds()) + ':' + (x.getMilliseconds());
      console.log(temperatura);
      var strData = {"label": formatted,
                     "value": temperatura
                    }
//   Manda os dados para o cliente
      socket.emit('news', strData);
    }
  })
});

//Server escuta na porta 3000
http.listen(3000, function() {''
   console.log('Server na porta *:3000');
});