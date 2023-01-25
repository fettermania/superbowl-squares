import React, {Component} from 'react';
import { Card, Button, Icon } from 'semantic-ui-react';

import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link }  from '../routes';
import squaremodel from '../ethereum/squaremodel';

var config = require ('../ethereum/config.js');


console.log("Factory is");
console.log(config.factoryAddresses['goerli']);

console.log("Infura is");
console.log(config.infuraUrls['goerli']);


class SquaresList extends Component {

	state = {
		summaries: []
	};

	// NOTE: getInitialProps is next js specific, for initial server-side data load
	// Can't use componentDidMount fpr this!
	static async getInitialProps() {
		// TODO: take :network out of the URL instead of hardcoding 'goerli'
		const myFactory = factory(config.factoryAddresses['goerli']);
		const squareAddresses = await myFactory.methods.getDeployedSquares().call();

		return {squareAddresses};
	}

	static async retrieveSummary(address) {
		const square = squaremodel(address);
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
		const walletDetected = (typeof window !== "undefined" && typeof window.ethereum !== "undefined");
		const summaries = await Promise.all(
			this.props.squareAddresses
				.map(SquaresList.retrieveSummary));
		this.setState({summaries: summaries,
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
					(<Link  route={`/squares/${summary.squareAddress}`}>
			    		 <a>{summary.awayName} at {summary.homeName}</a>
		    		 </Link>),
		    	
				extra: ("Manager " + summary.manager.substring(0,8)) + ", cost: " + summary.squarePrice + " wei",
				fluid:true
			  };
			})

		return <Card.Group items={items} />;
	}
	render () {
		const installText = this.state.walletDetected ?
			(<div suppressHydrationWarning><em>Ethereum wallet detected (Use Goerli Test Network)</em> ✅</div>)
			: (<div suppressHydrationWarning><em>Ethereum wallet not detected (Use Goerli Test Network)</em> ❌.  Check out <a href="http://metamask.io">Metamask</a> or similar</div>);

 		return	<Layout>
		   <h4>{installText}</h4>
		  	
		  <div>
		  		<Link route="/squares/new">
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
