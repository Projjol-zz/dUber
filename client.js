const DHT = require('bittorrent-dht')
const net = require('net');

const dht = new DHT()

const baseHash = "ab280ff80cd7451beec35ad73398"
const driverHash = Buffer.from("driver", "utf8").toString("hex")
var infoHash = baseHash + driverHash
var DRIVER_LIST = {}
var isContacted = []

dht.listen(21000, function () {
    console.log('now listening for ' + infoHash)
  })

dht.lookup(infoHash)

dht.on('peer', function (peer, infoHash, from) {
    if (isContacted.indexOf(peer.host) == -1){
        console.log('found potential peer ' + peer.host + ':' + peer.port + ' through ' + from.address + ':' + from.port)
        isContacted.push(peer.host)
        DRIVER_LIST["0.0.0.0" + ':' + peer.port] = "driver"
        var client = new net.Socket();
        client.connect(parseInt(peer.port), "0.0.0.0", function(){
            console.log("<=========================")
            console.log("connected to " + peer.host + ":" + peer.port)
            client.write("ack")
            client.on("data", function (data) {
                responseObj = JSON.parse(data.toString())
                if (responseObj.hasOwnProperty("status")){
                    // first response
                    if (responseObj.status == "free"){
                        console.log("<=========================")
                        console.log("reaching out to available driver")
                        currentLatLon = {
                            lat: responseObj.location.lat - 0.1,
                            lon: responseObj.location.lon - 0.1
                        }
                        bookRequest = {
                            location: currentLatLon
                        }
                        client.write(Buffer.from(JSON.stringify(bookRequest)))
                    }
                }
                if (responseObj.hasOwnProperty("cost")){
                    console.log("<=========================")
                    console.log("price quoted by driver is Rs " + Math.floor(responseObj.cost))
                    client.write("ack2")
                }
            })
        })
    }  
})


