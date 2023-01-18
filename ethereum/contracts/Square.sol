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
  string public competitionName;
  string public homeName;
  string public awayName;
  uint public squarePrice;
  address public manager;
  
  uint lockedTimestamp; // Locked if this is not zero.
  int8 completed; // TODO change to "Winner" or something.  Indicates winner cell, or -1 (not completed)

  // TODO Test this against a map again.
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
      completed = -1;   
  }

  function getSummary() public view returns (
    string, string, string, uint, address, uint, int8) {

      return (
          competitionName,
          homeName,
          awayName,
          squarePrice,
          manager,
          lockedTimestamp, // TODO Added
          completed
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

  function getSelectors() public view returns (address[100] memory) {
    return selectors;
  }

 // SetLocked=true reveals the board 
  function setLocked() public onlyManagerCanCall {
   lockedTimestamp = block.timestamp;
  }

  // TODO Ensure picking ROW and COL, not scores
  // note "this" is current contract
  // TODO Is repeating the array index logic cheaper than storing?
  function pickWinner(uint8 homeRow, uint8 awayCol) public onlyManagerCanCall {
    require(homeRow <= 9);
    require(awayCol <= 9);
    require(completed == -1);

    if(selectors[homeRow * 10 + awayCol] == 0x0000000000000000000000000000000000000000) {
      // Refund case
      // TODO Fix this.  Make a smaller number of transactions
      for (uint i = 0; i < 100; i++) {
        if (selectors[i] != 0x0000000000000000000000000000000000000000) {
          selectors[i].transfer(squarePrice);
        }
      }
    } else { 
      address player = selectors[homeRow * 10 + awayCol];
      player.transfer(address(this).balance);
    }

    // Note: this may not correspond to a purchased ticket!
    completed = int8(homeRow * 10 + awayCol);
  }

  modifier onlyManagerCanCall() {
    require(msg.sender == manager);
    _; // note: this is where the attached function's code 
      // goes
  }

}