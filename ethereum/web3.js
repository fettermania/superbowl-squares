import Web3 from "web3";
var config = require ('./config.js');

let web3;

// NOTE: GOTCHA -  global window not availble on node.  Just in browser. 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {

// <BEGIN Web3 required update>
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);

} else {

  // TODO 1/24 - does this matter?
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
	"https://goerli.infura.io/v3/ff70651fd5594fbaa8937fc612054fa6"
  );
  web3 = new Web3(provider);
}
 
export default web3;