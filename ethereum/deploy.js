const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
//const { abi, evm } = require('./compile');
// TODO : Update to newer versin ^^^
 
const compiledSquareFactory = require('./build/SquareFactory.json');

// TODO Get new rinkeby?
const provider = new HDWalletProvider(
  process.env.METAMASK_PHRASE,
    'https://goerli.infura.io/v3/ff70651fd5594fbaa8937fc612054fa6' // 1/18/2023
  );

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);
  try {
    const result = await new web3.eth.Contract(JSON.parse(compiledSquareFactory.interface))
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
