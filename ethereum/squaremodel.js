import web3 from './web3';
import SquareJSON from './build/Square.json';

// TODONEW : DSF singleton
let address = '0x7D1820e7E18ba241996AfaaBB3486c80DfAeB529';

// Note: expots a function, not a class
const instance = new web3.eth.Contract(
		JSON.parse(SquareJSON.interface),
		address);

export default instance;
