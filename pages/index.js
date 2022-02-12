import React, {Component} from 'react';
import { Card, Button, Grid } from 'semantic-ui-react';

import SquareRow from '../components/SquareRow';
import squaremodel from '../ethereum/squaremodel';
//import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link }  from '../routes';
import web3 from '../ethereum/web3.js';

class SquaresIndex extends Component {
	// TODO move these
	static nullAddress = '0x0000000000000000000000000000000000000000';
	static entryPriceInEther = 0.001;

	state = {
		accounts: [] // TODO Gross global variable
	};

	static selectionsTo2D(squareSelections) {
		var rows = new Array(10);
		var i = 0;
		for (var row = 0; row < 10; row++) {
			rows[row] = new Array(10);
			for (var col = 0; col < 10; col++) {
				rows[row][col] = squareSelections[i];
				i++; // TODO this is dirty but who cares
			}
		}
		return rows;
	}

	static async getInitialProps() {
		const squareSelections =  await squaremodel.methods.getSelectors().call();
		const rows = SquaresIndex.selectionsTo2D(squareSelections);
		const locked = await squaremodel.methods.getLocked().call();
		return {squareSelections, rows, locked};  // sugar for  { squareSelections : squareSelections}
	}

	// TODO Getting accounts here - is that bad?
	async componentDidMount() {
		const accounts = await web3.eth.getAccounts();
		this.setState({accounts: accounts});
	}

	renderRows() {
		return this.props.rows.map((rowSelections, index) => {
			return (<SquareRow 
							key={index}
							row={index}
							rowBuyerAddresses={rowSelections}
							viewerAddress={this.state.accounts[0]}
							/>);
		});
	}

	renderSquareGrid() {
		// TODO Fix this hardcoded nonsnese
		const headerContent = Array(10).fill().map(
			(n, index) => {
				return <Grid.Column key={index} width={1}><Card>{index}</Card></Grid.Column>; }
				)

		return (
			<Grid>
				<Grid.Row >
					<Grid.Column key={0} width={1}><Card><div color="red">TODO</div></Card></Grid.Column>
					{headerContent}
				</Grid.Row>
				{this.renderRows()}
			</Grid>
		);
	}

	renderStatsBlock() {
		const squaresTaken = this.props.squareSelections.filter(address => 
			address != SquaresIndex.nullAddress);

		const countSquaresTaken = squaresTaken.length;
		// TODO Does this ever return multiple accounts?
		const countSquaresYouBought = this.props.squareSelections.filter(address => 
			address == this.state.accounts[0]).length;

		const totalAccounts = (	new Set(squaresTaken)).size;
		const squaresLeft = 100 - squaresTaken;
		const items = [

	   {
        header: SquaresIndex.entryPriceInEther,
        description: 'Entry price (in ether)',
     	},
	   {
        header: countSquaresTaken,
        description: 'Squares Taken'
     	},
		{
        header: SquaresIndex.entryPriceInEther * countSquaresTaken,
        description: 'Total at stake (in ether)'
     	},
      {
        header: countSquaresYouBought,
        description: 'Squares you (account ' + this.state.accounts[0] + ') bought',
        style: {overflowWrap: 'break-word'}
      },
  		{
        header: SquaresIndex.entryPriceInEther * countSquaresYouBought,
        description: 'Your total stake (in ether)'
     	},
       {
        header: totalAccounts,
        description: 'Total Players'
    	}
    ];

  		return (<Card.Group items={items} />);

	}

	render () {
		const lockedText = this.props.locked ? " - LOCKED!" : ""
		return (<Layout>
		  <div>
		  	<h3>Squares{lockedText}</h3>
		  	{this.renderSquareGrid()}
  			<h3>Stats</h3>
  			{this.renderStatsBlock()}
 		</div>
 		</Layout>);
	}
}

export default SquaresIndex;
