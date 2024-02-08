import web3 from './web3';

// TODO Consider building many superbowl squares.
import SquareFactory from './build/SquareFactory.json';

	// TODO 1/24 - make it like this:
export default (address) => {
	return new web3.eth.Contract(
		JSON.parse(SquareFactory.interface),
		address);
};	


