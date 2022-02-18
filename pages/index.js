import React, {Component} from 'react';
import { Card, Button } from 'semantic-ui-react';

import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link }  from '../routes';
import squaremodel from '../ethereum/squaremodel';

class SquaresList extends Component {

	state = {
		summaries: []
	};

	// NOTE: getInitialProps is next js specific, for initial server-side data load
	// Can't use componentDidMount fpr this!
	static async getInitialProps() {
		const squareAddresses = await factory.methods.getDeployedSquares().call();

		return {squareAddresses};
	}

	static async retrieveSummary(address) {
		const square = squaremodel(address);
		const summaryRaw = await square.methods.getSummary().call();
		const summary = {
			competitionName: summaryRaw[0],
			squarePrice: summaryRaw[1],
          	manager: summaryRaw[2],
          	locked: summaryRaw[3],
          	squareAddress: address
		}
		return summary;
	}
	async componentDidMount() {
		const summaries = await Promise.all(
			this.props.squareAddresses
				.map(SquaresList.retrieveSummary));
		this.setState({summaries: summaries});
	}

	// TODO : Disable if locked, or indicate as such	
	renderSquaresList() {	
		const items = this.state.summaries.map((summary, index) => {
			return {
				header: summary.competitionName,
				description: 
					(<Link  route={`/squares/${summary.squareAddress}`}>
			    		 <a>{summary.squarePrice} wei</a>
		    		 </Link>),
				extra: "Manager " + summary.manager,
				fluid:true
			  };
			})

		return <Card.Group items={items} />;
	}
	render () {
		return	<Layout>
		  <div>
		  		<Link route="/squares/new">
  				 <a> 
					 		<Button 
					 			floated="right"
					 			content="Create Square"
					 			icon="add circle"
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
