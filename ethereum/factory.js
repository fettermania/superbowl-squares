import web3 from './web3';

// TODO Consider building many superbowl squares.
import SquareFactory from './build/SquareFactory.json';

const instance = new web3.eth.Contract(
	JSON.parse(Square.interface),
	 '0x12AA85Fd8C2E04150079274101eB4BB2C130F178' // Rinkeby
	);

export default instance;

