// SPDX-License-Identifier: MIT

pragma solidity ^0.4.17;

contract SquareFactory {
  address[] public deployedSquares;
  
  function createSquare(string competitionName, uint squarePrice) public {
    address newSquare = new Square(competitionName, squarePrice, msg.sender);
    deployedSquares.push(newSquare);
  }

  function getDeployedSquares() public view returns (address[]) {
      return deployedSquares; 
  }
}

contract Square {
  address public manager;
  uint public squarePrice;
  string public competitionName;

  address[100] public selectors;
  bool locked;
  bool completed; 

  // note: gloval variable msg auto-provided with any invocation
  // .data, .gas, .sender, .value
  constructor(string name, uint price, address creator) public {
      competitionName = name;
      squarePrice = price;
      manager = creator;

      locked = false;
      completed = false;
  }

  function getSummary() public view returns (
    string, uint, address, bool, bool) {

      return (
          competitionName,
          squarePrice,
          manager,
          locked,
          completed
          );
  }

  function makeSelection(uint home, uint away) public payable {
      require(msg.value == squarePrice);
      require(!locked);

      require(home >= 0 && home <= 9);
      require(away >= 0 && away <= 9);
      require(selectors[home * 10 + away] == 0x0000000000000000000000000000000000000000);
      selectors[home * 10 + away] = msg.sender;
    }

  function getSelectors() public view returns (address[100] memory) {
    return selectors;
  }

  function setLocked(bool newState) public onlyManagerCanCall {
    locked = newState;
  }

  // note "this" is current contract
  function pickWinner(uint home, uint away) public onlyManagerCanCall {
    require(home >= 0 && home <= 9);
    require(away >= 0 && away <= 9);
    require(selectors[home * 10 + away] != 0x0000000000000000000000000000000000000000);
    
    address player = selectors[home * 10 + away];
    player.transfer(address(this).balance);
    locked = false;
    completed = true;
  }

  modifier onlyManagerCanCall() {
    require(msg.sender == manager);
    _; // note: this is where the attached function's code 
      // goes
  }

}