const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());


// TODO
let accounts;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts(); // get ganache account

});

describe ('Campaigns', () => {
	it ('TODO', () => {
		assert.ok(true);
	});
});


var seded
