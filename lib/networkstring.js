
// TODO 1/25 - deprecatethis
// TODO: Note - this should be handled more elegantly. - 1/23
 function getEthNetwork() {

 	if (typeof window !== "undefined" && window.location.search !== "undefined" && window.location.search.substring(1)  !== "") {
		if (typeof window !== "undefined") { console.log("Got window search" + window.location.search)}
 		return  window.location.search.substring(1)
	} else {
		return "mainnet";
	}
}

function whereAmI() {
	if (typeof window === "undefined") {
		return 'server';
	} else if (window.ethereum === "undefined") {
		return 'client, no eth';
	} else {
		return 'client WALLET CONNECTED';
	}
}

export  {getEthNetwork, whereAmI };
