import web3 from './web3';
import SquareJSON from './build/Square.json';

// TODONEW : DSF singleton
let address = '0x832bc8d56065dd710f28d05276847471079ccA5A';

// Note: expots a function, not a class
const instance = new web3.eth.Contract(
		JSON.parse(SquareJSON.interface),
		address);

export default instance;
