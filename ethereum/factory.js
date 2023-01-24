import web3 from './web3';

import SquareFactory from './build/SquareFactory.json';

// TODO 1/24 - instantiate this once we know our network?

// const instance = new web3.eth.Contract(
// 	JSON.parse(SquareFactory.interface),
// 		'0xD1339a18eD8f8479628c06294C21180Ba60C4B5e'
// 	);

// TODO 1/24 - make it like this:
export default (address) => {
	return new web3.eth.Contract(
		JSON.parse(SquareFactory.interface),
		address);
};	
