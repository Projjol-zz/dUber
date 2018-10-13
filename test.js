var DHT = require('bittorrent-dht')
var dht = new DHT()

var PORT = generateRandomInteger(20000,30000);
var DRIVER_LIST = {}

dht.listen(PORT, function () {
    console.log('now listening')
  })
  
dht.on('peer', function (peer, infoHash, from) {
console.log('found potential peer ' + peer.host + ':' + peer.port + ' through ' + from.address + ':' + from.port)
DRIVER_LIST[peer.host + ':' + peer.port] = "driver"
})

dht.announce("ab280ff80cd647269766572", function checkResult(params) {
    console.log("result is " + params)
})

function generateRandomInteger(min, max) {
    return Math.floor(min + Math.random()*(max + 1 - min))
}