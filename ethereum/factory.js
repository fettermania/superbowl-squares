import web3 from './web3';

// TODO Consider building many superbowl squares.
import SquareFactory from './build/SquareFactory.json';

const instance = new web3.eth.Contract(
	JSON.parse(SquareFactory.interface),
	 '0xd52cE536dA452cda10b3d144248738568541291B' // Rinkeby
	);

export default instance;

