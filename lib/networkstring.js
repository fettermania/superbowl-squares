import { Link, Router }  from '../routes';
import { makeWeb3 } from '../ethereum/web3';

function generateEtherscanURL (address, network) {
	var prefix = ((network == 'mainnet') ? '' : (network + '.'));
	return 'http://' + prefix + 'etherscan.io/address/' + address;
}

export {generateEtherscanURL};
