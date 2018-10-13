const DHT = require('bittorrent-dht')
const dht = new DHT()
const baseHash = "ab280ff80cd7451beec35ad73398"
const driverHash = Buffer.from("driver", "utf8").toString("hex")
var DRIVER_LIST = {}
var subscriberUsedPorts = [] // let one peer not be init-ed more than once
module.exports = (router) => {
    router.post("/init", async( request, response, next) => {
        if (subscriberUsedPorts.indexOf(process.env.port) == -1 && subscriberUsedPorts.length > 1){
            console.log("entered")
            response.status(400);
            return response.json({"message": "already initialized"})
        } else {
            // dht.listen(process.env.port, function () {
            //     console.log('now listening')
            //     subscriberUsedPorts.push(process.env.port)
            // })
            var infoHash = baseHash + driverHash
            console.log(infoHash);
            dht.lookup(infoHash)
            dht.on('peer', function (peer, infoHashForFunc, from) {
                console.log('found potential peer ' + peer.host + ':' + peer.port + ' through ' + from.address + ':' + from.port)
                DRIVER_LIST[peer.host + ':' + peer.port] = "driver"
            })
            response.json({"status": true})
            console.log("driver list :" + DRIVER_LIST)
        }
    });

    router.post("/peers", async( request, response, next) => {
        
            // response.json({"status": true, "data": DRIVER_LIST})
            for(i =0; i<Object.keys(DRIVER_LIST).length; i++){

            }
    })

}