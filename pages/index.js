import React, {Component} from 'react';
import { Card, Button, Icon } from 'semantic-ui-react';

import Layout from '../components/Layout';

class SquaresHome extends Component {

	render () {
 		return <Layout network="">
 		This is an Ethereum-backed version of Superbowl Squares.  It is open and can be used for non-Superbowl games as well.
		
 		<p/>
		<b>Setting your Wallet up</b>

			<div className="ui bulleted list">
		 		<div className="item">
		 			In order to play, you should install an Ethereum-compatible Wallet like <a href="metamask.io">MetaMask</a>.
		 		</div>
		 		 <div className="item">
	 					Then, use the top nav to interact  with test ether in the <a href="/goerli/">Goerli testnet</a> 
	 					(in the nav) or for real on the <a href="/mainnet/">Mainnet</a>.  
	 					Make sure your wallet is set in accordance.
				</div>
				</div>

 		<p/>
		<b>Playing</b>

			<div className="ui bulleted list">
		 		<div className="item">
		 			The goal of this every winner-take-all game is to pick the square corresponding to the correct score ending of some sporting event.  
		 			So, picking the square Home (3), Away (7) would win with scores of 13-7, 3-27, 43-77, etc.
		 		</div>
				<div className="item">
		 			Each entry costs some amount of ether, uniform for that game, detailed at the bottom of the "show" page.
		 		</div>
		 		<div className="item">
		 			If the winning square of the sports contest has no owner, all ticket prices (minus any gas) are refunded.
		 		</div>
		 	</div>

		<b>Admin</b>

			<div className="ui bulleted list">
		 		<div className="item">
		 			The admin has the ability to <b>create a contest</b> (setting its price, name, and home / away team names), <b>permanently lock the entries</b>, and <b>submit the score</b>
		 		</div>
		 		<div className="item">
		 			<b>Create</b> a new set of squares from the blue button the main page of your network (/goerli/ or /mainnet/).  
		 			Set the price (in wei) and names accordingly.  These cannot be changed (maximum distrust!)
		 		</div> 
		 		<div className="item">
		 			<b>Spread the word</b> or don't.  These contests are by design open to all, and they all appear in the main list.
				</div> 
				<div className="item">
		 			<b>Lock entries</b> behind the Manage button (visible to admin only) on the contest page.  There is no specified time for this, but it should happen before the game begins.
				</div> 
				<div className="item">
		 			<b>Submit Score</b> when the game has completed.  This either sends the balance of the contract to the winner or refunds all if that square has no owner.
				</div> 
			</div>

		<b>Etc</b>

			<div className="ui bulleted list">
				<div className="item">
		 			This dApp operates entirely on the Ethereum blockchain.  All storage, including metadata, is on-chain.  Identites are provided by your wallet only.
		 		</div>
		 		<div className="item">
		 			The contracts are designed to be immutable except for squares before lock.  They cannot be adjusted from the Bnegals to the Bengals, for the same reason they can't be adjusted from the Bengals to the Ravens.
		 		</div>
		 		<div className="item">
		 			This is maintained by fettermania@gmail.com.  Hit me up with any questions or problems.  
		 		</div>
		 		<div className="item">
		 			The gas costs of all non-ticket calls, including game creation, locking, and submitting score, are borne by the administrator.  Night and early morning in the US are cheapest.
		 			Expect the gas price creating a contest to be $20-30 and buying a square to be $1-2 (on top of the part going into the pot)
		 		</div>
		 		<div className="item">
		 			The code for everythig is <a href="https://github.com/fettermania/superbowl-squares/">on github</a>.  The contracts (e.g. <a href="https://etherscan.io/address/0x6dded5d52d379ba501420b8570c9dc478895198a">this one</a>) are inspectable as well.
		 		</div>
		 	</div>


			</Layout>;
	}
}

export default SquaresHome;