// USAGE:
// node deploy.js goerli
// OR node deploy.js mainnet

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
var config = require ('./config.js');

var argNetwork = process.argv[2];
if (!config.infuraUrls[argNetwork]) {
  console.log("Usage: node deploy.js [mainnet|goerli]");
  process.exit();
}
const compiledSquareFactory = require('./build/SquareFactory.json');

// TODO Get new rinkeby?
const provider = new HDWalletProvider(
  process.env.METAMASK_PHRASE,
  config.infuraUrls[argNetwork]
//'https://mainnet.infura.io/v3/b2d352d974ab45d8bd72f4af53a01f16' // 2023 - Infura API key
// 'https://rinkeby.infura.io/v3/b2d352d974ab45d8bd72f4af53a01f16'
// 'https://goerli.infura.io/v3/b2d352d974ab45d8bd72f4af53a01f16' // 2023
//'https://goerli.infura.io/v3/ff70651fd5594fbaa8937fc612054fa6' // 1/18/2023
  );


const serverWeb3 = new Web3(provider);

const deploy = async () => {
  const accounts = await serverWeb3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);
  console.log('Through interface', config.infuraUrls[argNetwork]);
  try {
    const result = await new serverWeb3.eth.Contract(JSON.parse(compiledSquareFactory.interface))
    //  .deploy({ data: evm.bytecode.object })
      .deploy({ data: compiledSquareFactory.bytecode })
        .send({ gas: '1000000', from: accounts[0] });
     console.log('Contract deployed to', result.options.address);
  } catch (err) { 
    console.log("GOT ERROR");
    console.log(JSON.stringify(err));
  }
  // const result = await new web3.eth.Contract(abi)
  //   .deploy({ data: evm.bytecode.object })
  //   .send({ gas: '1000000', from: accounts[0] });

//  console.log(JSON.stringify(abi));
  provider.engine.stop();
};
deploy();
