
function whereAmI() {
	if (typeof window === "undefined") {
		return 'server';
	} else if (window.ethereum === "undefined") {
		return 'client, no eth';
	} else {
		return 'client WALLET CONNECTED';
	}
}

function generateEtherscanURL (address, network) {
	var prefix = ((network == 'mainnet') ? '' : (network + '.'));
	return 'http://' + prefix + 'etherscan.io/address/' + address;
}

export  {whereAmI, generateEtherscanURL };