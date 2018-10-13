const DHT = require('bittorrent-dht')
const dht = new DHT()
const baseHash = "ab280ff80cd7451beec35ad73398"
const driverHash = Buffer.from("driver", "utf8").toString("hex")
var usedPorts = [] // let one peer not be init-ed more than once

// dht.listen(20000, function () {
//     console.log('now listening yolo')
//     usedPorts.push(process.env.port)
// })

module.exports = (router) => {
    router.post("/init", async( request, response, next) => {
        console.log("hi")
        if (usedPorts.indexOf(process.env.port) == -1 && usedPorts.length > 0){
            response.status(400);
            response.json({"message": "already initialized"})
        } else {
            console.log("driver init " + process.env.port)
            // dht.listen(20000, function () {
            //     console.log('now listening')
            //     usedPorts.push(process.env.port)
            // })
            var infoHash = baseHash + driverHash
            var infoHash = "ab280ff80cd7451beec35ad73398647269766572"
            dht.announce(infoHash, parseInt(process.env.port), function checkResult(params) {
                console.log(process.env.port)
                console.log("result is " + params)
            })
            response.json({"success": true})
        }
    });
}