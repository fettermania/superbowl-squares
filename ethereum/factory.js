import web3 from './web3';

// TODO Consider building many superbowl squares.
import SquareFactory from './build/SquareFactory.json';

const instance = new web3.eth.Contract(
	JSON.parse(SquareFactory.interface),
		'0x686D090aF266FAAcC137481aC8f71Fe3c5d13443'
	);

export default instance;

