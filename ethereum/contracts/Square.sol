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
  
  uint lockedTimestamp; // Locked if this is not zero.
  uint8 homeScore; 
  uint8 awayScore;
  bool isCompleted;

  address[100] public selectors;

  // note: gloval variable msg auto-provided with any invocation
  // .data, .gas, .sender, .value
  constructor(string name, string home, string away, uint price, address creator) public {
      competitionName = name;
      homeName = home;
      awayName = away;
      squarePrice = price;
      manager = creator;

      //lockedTimestamp = 0 ; //default
      //isCompleted = false; // dfault
  }

  // Note: This is technically extra code but about as cheap as making everything a public variable.
  function getSummary() public view returns (
    string, string, string, uint, address, uint, uint8, uint8, bool, address[100] memory) {
      return (
          competitionName,
          homeName,
          awayName,
          squarePrice,
          manager,
          lockedTimestamp,
          homeScore,
          awayScore,
          isCompleted, 
          selectors
          );
  }

  function makeSelection(uint8 homeRow, uint8 awayCol) public payable {
      require(msg.value == squarePrice);
      require(lockedTimestamp == 0);

      require(homeRow <= 9);
      require(awayCol <= 9);
      require(selectors[homeRow * 10 + awayCol] == 0x0000000000000000000000000000000000000000);
      selectors[homeRow * 10 + awayCol] = msg.sender;
    }

 // setLocked reveals/generates the board labels
  function setLocked() public onlyManagerCanCall {
   lockedTimestamp = block.timestamp;
  }

  function submitScore(uint8 winnerHomeRow, uint8 winnerAwayCol, uint8 homeScoreFinal, uint8 awayScoreFinal) public onlyManagerCanCall {
    require(winnerHomeRow <= 9);
    require(winnerAwayCol <= 9);
    require(isCompleted == false); // Must be unfinished
    require(lockedTimestamp > 0); // Must be locked (and thus having scores shown)

    if(selectors[winnerHomeRow * 10 + winnerAwayCol] == 0x0000000000000000000000000000000000000000) {
      // Refund case
      // TODO Optimization:  Group so one transaction per winner (maybe not even cheaper?)
      for (uint i = 0; i < 100; i++) {
        if (selectors[i] != 0x0000000000000000000000000000000000000000) {
          selectors[i].transfer(squarePrice);
        }
      }
    } else { 
      address player = selectors[winnerHomeRow * 10 + winnerAwayCol];
      player.transfer(address(this).balance);
    }

    homeScore = homeScoreFinal;
    awayScore = awayScoreFinal;
    isCompleted = true;
  }

  modifier onlyManagerCanCall() {
    require(msg.sender == manager);
    _; // note: this is where the attached function's code 
      // goes
  }

}