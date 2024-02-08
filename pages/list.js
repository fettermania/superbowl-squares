import React, {Component} from 'react';
import { Card, Button, Icon } from 'semantic-ui-react';

import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link, Router }  from '../routes';
import squaremodel from '../ethereum/squaremodel';
import { makeWeb3 } from '../ethereum/web3';
import {whereAmI } from '../lib/networkstring.js';

var config = require ('../ethereum/config.js');

class SquaresList extends Component {

	state = {
		summaries: []
	};

	// NOTE: getInitialProps is next js specific, for initial server-side data load
	// Can't use componentDidMount fpr this!
	// Called on server, sent over to cleint
	static async getInitialProps(props) {
		var network = props.query.network;
		return {network};
	}

	static async retrieveSummary(address, network) {

		const myWeb3 = makeWeb3(network);
		const square = squaremodel(address, myWeb3);
		const summaryRaw = await square.methods.getSummary().call();
		const summary = {
			competitionName: summaryRaw[0],
			homeName: summaryRaw[1],
	        awayName: summaryRaw[2],
			squarePrice: summaryRaw[3],
          	manager: summaryRaw[4],
          	lockedTimestamp: summaryRaw[5],
          	squareAddress: address,
          	isLocked: summaryRaw[5] > 0,
          	homeScore: summaryRaw[6],
          	awayScore: summaryRaw[7],          	
          	isCompleted: summaryRaw[8]

		}
		return summary;
	}
	async componentDidMount() {

		const myWeb3 = makeWeb3(this.props.network);
		const myFactory = factory(config.factoryAddresses[this.props.network], myWeb3);
		const squareAddresses = await myFactory.methods.getDeployedSquares().call();

		const walletDetected = (typeof window !== "undefined" && typeof window.ethereum !== "undefined");

		const summaries = await Promise.all(
			squareAddresses
				.map(SquaresList.retrieveSummary, this.props.network));
		this.setState({squareAddresses: squareAddresses, 
						summaries: summaries,
                       walletDetected: walletDetected});
	}

	// TODO : Disable if locked, or indicate as such	
	renderSquaresList() {	
		const items = this.state.summaries.map((summary, index) => {
			let icon;
			if (summary.isCompleted) { // completed implies locked
				icon = <Icon color='grey' name='check'/>
			} else if (summary.isLocked) {
				icon = <Icon color='red' name='lock'/>;
			} else {
				icon = <Icon color='green' name='angle right'/>
			}
			return {
				header: (summary.competitionName),
				meta: icon,
				description: 
					(<Link  route={`/squares/${this.props.network}/${summary.squareAddress}`}>
			    		 <a>{summary.awayName} at {summary.homeName}</a>
		    		 </Link>),
		    	
				extra: ("Manager " + summary.manager.substring(0,8)) + ", cost: " + summary.squarePrice + " wei",
				fluid:true
			  };
			})

		return <Card.Group items={items} />;
	}
	render () {

		return	<Layout network={this.props.network}>	
			<div>
	    		<Link route={`/squares/${this.props.network}/new`}>

  				 <a> 
					 		<Button 
					 			floated="right"
					 			content="Create Square"
					 			icon="add circle"
					 			disabled={!this.state.walletDetected}
					 			primary 
					 		/>	
				 	  </a> 
			 		</Link>
		 	{this.renderSquaresList()}

 			</div>
 			</Layout>;
	}
}

export default SquaresList;