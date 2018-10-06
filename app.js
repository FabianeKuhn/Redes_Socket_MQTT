var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
//Indica a utilização do socket.io
var io = require('socket.io')(http);
//Inclui PubNub JavaScript SDK 
//********* Deverá ser eliminado ao utilizarmos o MQTT*********
var PubNub = require('pubnub');

const mqtt    = require("mqtt");
var clientMqtt    = mqtt.connect('mqtt:iot.eclipse.org:1883');

//Apresenta o diretório dist para o uso do webpack, que se tornou necessário pelo fato do FusionCharts
//não ser compatível com o ES6
app.use(express.static('./dist'));

app.get('/', function(req, res) {
   res.sendfile('index.html');
});


//Conexão do socket
// io.on('connection', function (socket) {
//------------------------------------------------------------->>Mqtt 
// clientMqtt.subscribe("k79Dp1E2rn/central/sensor", { qos: 1 }, function(err, granted) {
//   if (err)
//     console.log(err);
//   else
//   {
//     console.log("clientMqtt connected : ", granted);
//   }
// });

// /*** clientMqtt on connect ***/
// clientMqtt.on("connect", function() {
//   console.log("client is connected");
// })

// /*** clientMqtt on reconnect ***/
// clientMqtt.on("reconnect", function() {
//   console.log("client is reconnected");
// })

// /*** clientMqtt on error ***/
// clientMqtt.on("error", function(err) {
//   console.log("error from clientMqtt --> ", err);
// })

/*** clientMqtt on close ***/
// clientMqtt.on("close", function() {
//     console.log("clientMqtt is closed");
//   })

// /*** clientMqtt on offline ***/
// clientMqtt.on("offline", function(err) {
//   console.log("clientMqtt is offline");
// });


// clientMqtt.on('message', function(topic, message) { 
//   var centralData = JSON.parse(message.toString());
 
//   if(topic == "k79Dp1E2rn/central/sensor")
//   { 

//     var x = new Date();
// //Formata a hora da medida
//     var formatted =  (x.getHours()) + ':' + (x.getMinutes()) + ':' + (x.getSeconds()) + ':' + (x.getMilliseconds());

//     console.log("chegou  ");
//     console.log(centralData.umidade);

//     var strData = {"label": formatted,
//                            "value":centralData.v_bat
//                         }

//     console.log(strData.vale);
                            //Manda os dados para o cliente
    // socket.emit('news', strData);

    // var query =  "INSERT INTO medidas (ID_SENSOR, UMIDADE, DATA_HORA, BATERIA, TEMPERATURA, V_DGTARM, V_ANLARM, T_NTC, T_ARM, ADC_MEDIA, ADC_COMP, SNR, RSSI, U_AR, T_AR, REFERENCIA) VALUES(" + 
    // centralData.id + "," + centralData.umidade + " ,NOW(), " + centralData.v_bat + ",'0'," + centralData.v_dgtarm + "," + 
    // centralData.v_anlarm + "," + centralData.t_ntc + "," + centralData.t_arm + "," + centralData.adc_media + "," + 
    // centralData.adc_comp + "," + centralData.snr + "," + centralData.rssi + "," + centralData.u_ar + "," + 
    // centralData.t_ar + "," + centralData.referencia + ")";
    
    // db.runQuery(db.data, query, function(err, rows){
    //   if (err){
    //     //Publish error to a topic
    //     console.log(err.code);
    //   }
    // });
    

  // }
// })
// });

//------------------------------------------------------------->>Mqtt 





//Conexão do socket
io.on('connection', function (socket) {
    var strData;
//Instancia o PubNub para a carga dos dados
    pubnub = new PubNub({
        subscribeKey : 'sub-c-4377ab04-f100-11e3-bffd-02ee2ddab7fe'
    })
    //Adiciona o listener do PubNub

 //******Essa parte vai mudar toda******   
    pubnub.addListener({
        message: function(message) {
/*checking whether the message contains data for the ‘Apple’ category or not.*/
            if(message.message.symbol=='Apple'){
                      //  Creates a new date object from the specified message.timestamp. 
                var x = new Date(message.message.timestamp);
//Converting the timestamp into a desired format. HH:MM:SS:MS
        var formatted =  (x.getHours()) + ':' + (x.getMinutes()) + ':' + (x.getSeconds()) + ':' + (x.getMilliseconds());
                       /*Here we are creating an object which will contain a timestamp as label and the ‘order_quantity’ as value.*/
                strData = {"label": formatted,
                           "value":message.message.order_quantity
                        }
                                          //     sending data to the client
                socket.emit('news', strData);
            };  
        }
    })      
    console.log("Subscribing..");
//Subscribe the PubNub channel
    pubnub.subscribe({
        channels: ['pubnub-market-orders'] 
    });
});
//Server escuta na porta 3000
http.listen(3000, function() {
   console.log('Server na porta *:3000');
});
