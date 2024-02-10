// SPDX-License-Identifier: MIT

pragma solidity ^0.4.17;

contract SquareFactory {
  address[] public deployedSquares;
  
  function createSquare(string competitionName, string homeName, string awayName, uint squarePrice) public {
    address newSquare = new Square(competitionName, homeName, awayName, squarePrice, msg.sender);
    deployedSquares.push(newSquare);
  }

  function getDeployedSquares() public view returns (address[]) {
      return deployedSquares; 
  }
}

contract Square {
  string competitionName;
  string homeName;
  string awayName;
  uint squarePrice;
  address manager;
  
  // TODO these are all public?
  uint lockedTimestamp; // Locked if this is not zero.
  uint8 homeScore;
  uint8 awayScore;
  bool isCompleted;

  address[100] selectors;

  // TODO Test this against a map again.

  // note: gloval variable msg auto-provided with any invocation
  // .data, .gas, .sender, .value
  constructor(string name, string home, string away, uint price, address creator) public {
      competitionName = name;
      homeName = home;
      awayName = away;
      squarePrice = price;
      manager = creator;

      //lockedTimestamp = 0 ; //default
      //isCompleted = false;// default
  }

  function getSummary() public view returns (
    string, string, string, uint, address, uint, uint8, uint8, bool, address[100]) {

      return (
          competitionName,
          homeName,
          awayName,
          squarePrice,
          manager,
          lockedTimestamp,
          homeScore,
          awayScore,
          isCompleted, // Now a bool
          selectors
          );
  }

  // TODO Make uint8 as well.
  function makeSelection(uint8 homeRow, uint8 awayCol) public payable {
      require(msg.value == squarePrice);
      require(lockedTimestamp == 0);

      require(homeRow <= 9);
      require(awayCol <= 9);
      require(selectors[homeRow * 10 + awayCol] == 0x0000000000000000000000000000000000000000);
      selectors[homeRow * 10 + awayCol] = msg.sender;
    }

 // SetLocked=true reveals the board 
  function setLocked() public onlyManagerCanCall {
   lockedTimestamp = block.timestamp;
  }

  // note "this" is current contract
  function submitScore(uint8 homeScoreSubmitted, uint8 awayScoreSubmitted) public onlyManagerCanCall {
    require(isCompleted == false);
  // require(lockedTimestamp > 0); // Not strictly necessary - 2024.

    homeScore = homeScoreSubmitted;
    awayScore = awayScoreSubmitted;

    uint8 winnerIndex = (homeScoreSubmitted % 10) * 10 + (awayScoreSubmitted % 10);
    if(selectors[winnerIndex] == 0x0000000000000000000000000000000000000000) {
      // Refund case
      // TODO Fix this.  Make a smaller number of transactions
      for (uint i = 0; i < 100; i++) {
        if (selectors[i] != 0x0000000000000000000000000000000000000000) {
          selectors[i].transfer(squarePrice);
        }
      }
    } else { 
      address player = selectors[winnerIndex];
      player.transfer(address(this).balance);
    }

    isCompleted = true;
  }

  modifier onlyManagerCanCall() {
    require(msg.sender == manager);
    _; // note: this is where the attached function's code 
      // goes
  }

}