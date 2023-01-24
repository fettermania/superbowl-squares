import web3 from './web3';
import SquareJSON from './build/Square.json';

// TODO 1/24 - instantiate this once we know our network?  
// TODO 1/24 - also why is there a random instance here? 

// // Note: expots a function, not a class
// const instance = new web3.eth.Contract(
// 		JSON.parse(SquareJSON.interface),
// 		address);

// export default instance;

// Note: expots a function, not a class

export default (address) => {
	return new web3.eth.Contract(
		JSON.parse(SquareJSON.interface),
		address);
};	