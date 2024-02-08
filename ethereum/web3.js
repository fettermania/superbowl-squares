import Web3 from "web3";
var config = require ('./config.js');


// TODO 1/25 - try singleton later
let madeWeb3 = null;
function makeWeb3(networkString) {
  if (madeWeb3) {
    return madeWeb3;
  }

  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // <BEGIN Web3 required update>
    // We are in the browser and metamask is running.
    window.ethereum.request({ method: "eth_requestAccounts" });
    madeWeb3 = new Web3(window.ethereum);
  } else {
    var provider = new Web3.providers.HttpProvider(
      config.infuraUrls[networkString]
    );
    madeWeb3 = new Web3(provider);
  }
  return madeWeb3;
}
 
export { makeWeb3 };

//  	"https://goerli.infura.io/v3/b2d352d974ab45d8bd72f4af53a01f16" // 2023
 // "https://rinkeby.infura.io/v3/b2d352d974ab45d8bd72f4af53a01f16"
//   "https://rinkeby.infura.io/v3/15c1d32581894b88a92d8d9e519e476c" // TODO I think this one should be deleted (maybe instructor's?)
// "https://goerli.infura.io/v3/ff70651fd5594fbaa8937fc612054fa6"