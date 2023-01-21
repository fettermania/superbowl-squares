import web3 from './web3';

// TODO Consider building many superbowl squares.
import SquareFactory from './build/SquareFactory.json';

const instance = new web3.eth.Contract(
	JSON.parse(SquareFactory.interface),
		'0xdB09Fa4d5f58c6CC467E150f936504202d39C919'
	);

export default instance;

