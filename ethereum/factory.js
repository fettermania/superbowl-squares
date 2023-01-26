
import SquareFactory from './build/SquareFactory.json';

export default (address, myWeb3) => {
	return new myWeb3.eth.Contract(
		JSON.parse(SquareFactory.interface),
		address);
};	
