pragma solidity ^0.4.21;

contract RideSharing {
    
    address public driver;
    uint public escrow;
    bool public driverTrip;
    bool public riderTrip;

    mapping (address => uint) public balances;
    mapping (address => address) public driverRider;

    // This is the constructor whose code is
    // run only when the contract is created.
    constructor() public {
        driver = msg.sender;
    }

    function establishDeal(address rider, uint amount) public {
        if (msg.sender != driver) return;
        balances[rider] = amount;
        driverRider[driver] = rider;
        holdInEscrow(rider, amount);
    }

    function holdInEscrow(address rider, uint amount) public {
        balances[rider] -= amount;
        escrow = amount;
    }

    function driverCompletesTrip() public{
        if (msg.sender != driver) return;
        driverTrip = true;
        if(riderTrip && driverTrip){
            releaseEscrow();
        }
    }

    function riderAcceptsEndOfTrip() public {
        if(msg.sender == driver) return;
        riderTrip = true;
        if(riderTrip && driverTrip){
            releaseEscrow();
        }
    }

    function releaseEscrow() private {
        balances[driver] += escrow;
        escrow = 0; // effectively destroying escrow
    }
}