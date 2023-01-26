import {web3, makeweb3 }  from './web3';
import SquareJSON from './build/Square.json';

// TODO 1/25 - insert web3 as argument
export default (address, myWeb3) => {
	return new myWeb3.eth.Contract(
		JSON.parse(SquareJSON.interface),
		address);
};	