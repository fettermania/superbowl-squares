
import SquareFactory from './build/SquareFactory.json';

// TODO 1/25 - insert web3 as argument

export default (address, myWeb3) => {
	return new myWeb3.eth.Contract(
		JSON.parse(SquareFactory.interface),
		address);
};	
