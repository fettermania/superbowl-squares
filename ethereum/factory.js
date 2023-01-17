import web3 from './web3';

// TODO Consider building many superbowl squares.
import SquareFactory from './build/SquareFactory.json';

const instance = new web3.eth.Contract(
	JSON.parse(SquareFactory.interface),
//	 '0xd73dE68601e88b924B92fa01764b8739bC7074c9' // Rinkeby
//	 '0x92e83386701ab3CC0B0b1b3934D01f4c28982Db8' // Goerli
 	 '0xC14Eef54Cb0176bdF54D6b2357EC82BD98960A02' // GOERLI NEW
	);

export default instance;

