import web3 from './web3';

// TODO Consider building many superbowl squares.
import SquareFactory from './build/SquareFactory.json';

const instance = new web3.eth.Contract(
	JSON.parse(SquareFactory.interface),
		'0xD1339a18eD8f8479628c06294C21180Ba60C4B5e'
	);

export default instance;

