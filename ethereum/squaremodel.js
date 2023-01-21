import web3 from './web3';
import SquareJSON from './build/Square.json';

// // TODONEW : DSF singleton
//let address = '0x58163bbF45c107A796dE2A9D072441F4E7573aC3';  // MAINNET - one square
let address = '0x834733b008B45feA972B47FeffCB6b97eC5890Cc'; // 2023 GOERLI - one example of a square

// TODO 2023 - we don't need to request this every time.

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