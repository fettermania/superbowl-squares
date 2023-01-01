import web3 from './web3';

// TODO Consider building many superbowl squares.
import SquareFactory from './build/SquareFactory.json';

const instance = new web3.eth.Contract(
	JSON.parse(SquareFactory.interface),
//	 '0xd73dE68601e88b924B92fa01764b8739bC7074c9' // Rinkeby
	 '0x1a8c42f4fa59327e1D05050428A940C28C334274' // Goerli
	);

export default instance;

