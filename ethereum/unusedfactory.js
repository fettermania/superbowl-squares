import web3 from './web3';

// TODO Consider building many superbowl squares.
import CampaignFactory from './build/Square.json';

const instance = new web3.eth.Contract(
	JSON.parse(Square.interface),
//	 '0xD4CE9413EeE00789b99e041C7Ef7db288f67a1b3' // Rinkeby
	);

export default instance;

