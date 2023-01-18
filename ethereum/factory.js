import web3 from './web3';

// TODO Consider building many superbowl squares.
import SquareFactory from './build/SquareFactory.json';

const instance = new web3.eth.Contract(
	JSON.parse(SquareFactory.interface),
//	 '0xd73dE68601e88b924B92fa01764b8739bC7074c9' // Rinkeby
//	 '0x92e83386701ab3CC0B0b1b3934D01f4c28982Db8' // Goerli
 	 '0x284F00ae8Bad49d1F3aaebB27A729Bf1F8F3956b' // GOERLI NEW
	);

export default instance;

