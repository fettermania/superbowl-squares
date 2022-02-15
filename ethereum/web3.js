import Web3 from "web3";
 
let web3;

// NOTE: GOTCHA -  global window not availble on node.  Just in browser. 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {

// <BEGIN Web3 required update>
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);

} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
  	// TODO Fetterman
  	 'https://mainnet.infura.io/v3/b2d352d974ab45d8bd72f4af53a01f16'

//    "https://rinkeby.infura.io/v3/15c1d32581894b88a92d8d9e519e476c"
  );
  web3 = new Web3(provider);
}
 
export default web3;