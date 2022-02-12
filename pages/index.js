import React, {Component} from 'react';
import { Card, Button, Grid, Message } from 'semantic-ui-react';

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
		accounts: [], // TODO Gross global variable
		errorMessage: ''
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
		if(this.props.locked) {
			this.setState({errorMessage: 'Games are locked'})
		}
	}

	setTopError = (errorMessage) => {
        this.setState({errorMessage: errorMessage});
    }

	renderRows() {
		return this.props.rows.map((rowSelections, index) => {
			return (<SquareRow 
							key={index}
							row={index}
							locked={this.props.locked}
							setTopError={this.setTopError.bind(this)}
							rowBuyerAddresses={rowSelections}
							viewerAddress={this.state.accounts[0]}
							/>);
		});
	}

	renderSquareGrid() {
		// TODO Fix this hardcoded nonsnese
		const headerContent = Array(10).fill().map(
			(n, index) => {
				return <Grid.Column color="orange"  key={index}>{index}</Grid.Column>; }
				);

		return (
			// COLOR: Away Row
			<Grid textAlign="right">
				<Grid.Row >
					<Grid.Column key={0}></Grid.Column>
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

		const acctName = (this.state.accounts[0]) ? (this.state.accounts[0].substr(2,4) ) : "none";

		const totalAccounts = (	new Set(squaresTaken)).size;
		const squaresLeft = 100 - squaresTaken;
		const items = [

	   {
        header: (SquaresIndex.entryPriceInEther + "/$" + 3000*SquaresIndex.entryPriceInEther) ,
        description: 'Entry price (in ether)',
     	},
	   {
        header: countSquaresTaken,
        description: 'Squares Taken'
     	},
		{
        header: (SquaresIndex.entryPriceInEther * countSquaresTaken + "/$" + 
        	3000 * SquaresIndex.entryPriceInEther * countSquaresTaken),
        description: 'Total at stake (in ether)'
     	},
      {
        header: countSquaresYouBought,
        description: 'Your entries (account ' + acctName + '...)',
        style: {overflowWrap: 'break-word'}
      },
  		{
        header: 
        	(SquaresIndex.entryPriceInEther * countSquaresYouBought + "/$" + 
        	3000 * SquaresIndex.entryPriceInEther * countSquaresYouBought),
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
		const installText = (typeof window !== "undefined" && typeof window.ethereum !== "undefined") ?
			(<div suppressHydrationWarning>Ethereum wallet installed ✅</div>)
			: (<div suppressHydrationWarning>Ethereum wallet not installed ❌.  Check out <a href="http://metamask.io">Metamask</a> or similar</div>);

		return (<Layout>
		  	<h3 suppressHydrationWarning>{installText}</h3>
		  	<Message error hidden={!Boolean(this.state.errorMessage)} content={this.state.errorMessage} />
  			<h3>Stats</h3>
  			{this.renderStatsBlock()}
  			<h3>Squares</h3>
			<p/>
		  	{this.renderSquareGrid()}
 		</Layout>);
	}
}

export default SquaresIndex;
