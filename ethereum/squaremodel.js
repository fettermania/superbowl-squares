import web3 from './web3';
import SquareJSON from './build/Square.json';

// // TODONEW : DSF singleton
// let address = '0xa7844f765A0e80726Eb1893022a12A2d9d6416Ba'; // RINKEBY - v2
// // let address = '0x2b92288b6C2D24f99F9Cc12b79Cf31E64B797514'; // RINKEBY - v1

//let address = '0x58163bbF45c107A796dE2A9D072441F4E7573aC3';  // MAINNET - one square
// let address = '0xd7A8A1DB8601bBaBf7c34F5b324D9BE224087544'; // 2023 GOERLI - one example of a square

let address = '0xB20A1D8DA8b18152399656daC8A9135674bee04D'; // 2024 GOERLI - one example of a square
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