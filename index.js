var express = require('express'),
    enrouten = require('express-enrouten');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(enrouten({ directory: 'routes' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
if (process.env.port){
    console.log(process.env.port)
    PORT = process.env.port
} else {
    PORT = generateRandomInteger(20000,30000);
    process.env.port = PORT
}

console.log("port is " + process.env.port);

expressPort = generateRandomInteger(5000,6000)
console.log("express port is " + expressPort)

var server = require('http').Server(app);
var io = require('socket.io')(server);

app.listen(expressPort)  



// dht portion 

// var DHT = require('bittorrent-dht')
// var dht = new DHT()

// var PORT = generateRandomInteger(20000,30000);
// var DRIVER_LIST = {}
// var baseInfoHash = "ab280ff80cd7451beec35ad73398817"

// dht.listen(PORT, function () {
//     console.log('now listening')
//   })
  
// dht.on('peer', function (peer, infoHash, from) {
// console.log('found potential peer ' + peer.host + ':' + peer.port + ' through ' + from.address + ':' + from.port)
// DRIVER_LIST[peer.host + ':' + peer.port] = "driver"
// })

// var userType = getUserType()

// if (userType == "driver"){
//     var infoHash = "ab280ff80cd7451beec35ad73398817537driver"
//     dht.announce(infoHash)
// }

// if(userType == "user"){
//     var infoHash = "ab280ff80cd7451beec35ad73398817537driver"
//     dht.lookup(infoHash)
// }

function generateRandomInteger(min, max) {
    return Math.floor(min + Math.random()*(max + 1 - min))
}

// function getUserType() {
//     return process.env.WHOISUSER;
// }

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });