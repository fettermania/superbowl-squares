import web3 from './web3';

// TODO Consider building many superbowl squares.
import SquareFactory from './build/SquareFactory.json';

const instance = new web3.eth.Contract(
	JSON.parse(SquareFactory.interface),
		'0x834733b008B45feA972B47FeffCB6b97eC5890Cc' // 1/19
	);

export default instance;

