import web3 from './web3';
import SquareJSON from './build/Square.json';

// TODONEW : DSF singleton
let address = '0x2b92288b6C2D24f99F9Cc12b79Cf31E64B797514'; // RINKEBY
//let address = '0x58163bbF45c107A796dE2A9D072441F4E7573aC3'; // MAINNET


// Note: expots a function, not a class
const instance = new web3.eth.Contract(
		JSON.parse(SquareJSON.interface),
		address);

export default instance;
