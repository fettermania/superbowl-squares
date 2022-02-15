const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
//const { abi, evm } = require('./compile');
// TODO : Update to newer versin ^^^
 
const compiledSquare = require('./build/Square.json');

// TODO Get new rinkeby?
const provider = new HDWalletProvider(
  process.env.METAMASK_PHRASE,
 'https://mainnet.infura.io/v3/b2d352d974ab45d8bd72f4af53a01f16'
 //'https://rinkeby.infura.io/v3/b2d352d974ab45d8bd72f4af53a01f16'
  );


const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);
  try {
    const result = await new web3.eth.Contract(JSON.parse(compiledSquare.interface))
    //  .deploy({ data: evm.bytecode.object })
      .deploy({ data: compiledSquare.bytecode })
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
