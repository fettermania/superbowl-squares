// SPDX-License-Identifier: MIT

pragma solidity ^0.4.17;

contract Square {
  address public manager;
  address[100] public selectors;
  uint selectionCount;
  bool locked;

  // note: gloval variable msg auto-provided with any invocation
  // .data, .gas, .sender, .value
  function Square() public {
      manager = msg.sender;
      selectionCount = 0;
      locked = false;
  }

  function makeSelection(uint home, uint away) public payable {
      require(msg.value == .001 ether);
      require(!locked);

      require(home >= 0 && home <= 9);
      require(away >= 0 && away <= 9);
      require(selectors[home * 10 + away] == 0x0000000000000000000000000000000000000000);
      selectors[home * 10 + away] = msg.sender;
      selectionCount++;
  }

  function getSelectors() public view returns (address[100] memory) {
    return selectors;
  }

  function getLocked() public view returns (bool) {
    return locked;
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
    player.transfer(this.balance); 
    delete selectors; // TODO - does this ruin the contract? Maybe that's a good thing.
    selectionCount = 0;
    locked = false;
  }

  modifier onlyManagerCanCall() {
    require(msg.sender == manager);
    _; // note: this is where the attached function's code 
      // goes
  }

}