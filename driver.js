const DHT = require('bittorrent-dht')
const Distance = require('geo-distance');
const fs = require("fs");
const Web3 = require('web3');
const solc = require('solc');
const path=require('path');

const baseHash = "ab280ff80cd7451beec35ad73398"
const driverHash = Buffer.from("driver", "utf8").toString("hex")

var locationCache = {}
var dht = DHT()
var infoHash = baseHash + driverHash

// dht.listen(20000, function () {
//     console.log('now listening')
// })

function generateRandomFloat(min, max) {
    floatGenerated = min + Math.random()
    if (floatGenerated > max){
        diff = floatGenerated - max
        floatGenerated = min + diff
    }
    return floatGenerated
}

const locationBuilder = function(){
    lat = generateRandomFloat(12,13)
    lon = generateRandomFloat(77,79)
    return {lat: lat, lon: lon}
}

dht.announce(infoHash, 1337, function checkResult(params) {
    if (!params){
        console.log("================>")
        console.log("registered on DHT")
    } else {
        console.log("=========================>")
        console.log("failed to register driver")
    }
})

var net = require('net');

var server = net.createServer(function(socket) {
	// socket.write('Echo server\r\n');
});

server.listen(1337, '0.0.0.0');

server.on("connection", function (socket) {
    console.log("<=========================")
    console.log("connection made by " + socket.remoteAddress + ":" + socket.remotePort)
    socket.on("data", function(data){
        if(data == "ack"){
            stringDataHandler(data, socket)
        } else if (data == "ack2"){
            console.log("<=========================")
            console.log("rider accepts quoted price")
            console.log("=========================>")
            console.log("initiating smart contract for ride")
            web3 = new Web3("http://127.0.0.1:7545") // connect to blockchain
            const helloPath = path.resolve('rideSharing.sol');
            const source = fs.readFileSync(helloPath, 'UTF-8');
            compiledSolc = solc.compile(source, 1).contracts[':RideSharing'];
            abi = compiledSolc.interface;
            code = '0x' + compiledSolc.bytecode;
            // SampleContract3 = new web3.eth.Contract(JSON.parse(abi))
            account1 = "0x95a7f4c8d68B38eD06B4FCd1FEAb06AC61F9619d"
            var SampleContract3 = new web3.eth.Contract(JSON.parse(abi), {
                from: account1,
                gasPrice: "20000000000",
            })
            contract = SampleContract3.deploy({
                 data: code
            })
            contract.send({from: account1,gas: 1500000,gasPrice: '30000000000000'}, (err, th) => {console.log("transaction hash: " + th)}).on('receipt', function(receipt){console.log("contract deployed at: " + receipt.contractAddress)})

        } else if (typeof data == "object"){
            objectDataHandler(data, socket)
        }
    });
})

const stringDataHandler = function (data, socket) {
    location = locationBuilder()
    status = "free"
    response = {
        location: location,
        status: status
    }
    locationCache = location;
    socket.write(Buffer.from(JSON.stringify(response)));
}

const objectDataHandler = function (data, socket){
    riderData = JSON.parse(data.toString())
    riderLatLon = riderData.location
    var riderDriverDistance = Distance.between(riderLatLon, locationCache)
    var cabCost = costCalculator.base + costCalculator.costPerMile * riderDriverDistance
    rideDetails = {
        cost: cabCost
    }
    socket.write(Buffer.from(JSON.stringify(rideDetails)))
}


costCalculator = {
    base: 50,
    costPerMile: 10
}