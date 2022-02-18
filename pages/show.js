import React, {Component} from 'react';
import { Card, Button, Grid, Message } from 'semantic-ui-react';

import SquareRow from '../components/SquareRow';
import squaremodel from '../ethereum/squaremodel';
//import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link }  from '../routes';
import web3 from '../ethereum/web3.js';

class SquaresDetail extends Component {
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


	// TODO Note: getInitialProps is a nextJS thing for server only!
	// TODO Use componentDidMount (a react thing)
	static async getInitialProps(props) {

		// TODO How can we pass the object instead of just the address?
		const squareAddress = props.query.address;
		const square = squaremodel(props.query.address);
		const summaryRaw = await square.methods.getSummary().call();
		const squareSelections =  await square.methods.getSelectors().call();
		const rows = SquaresDetail.selectionsTo2D(squareSelections);
		const summary = {
			competitionName: summaryRaw[0],
			squarePrice: summaryRaw[1],
          	manager: summaryRaw[2],
          	locked: summaryRaw[3]
		}
		
		// sugar for  { squareSelections : squareSelections}
		return {squareAddress, squareSelections, rows, summary};  
	}

	// TODO Getting accounts here - is that bad?
	async componentDidMount() {
		const accounts = await web3.eth.getAccounts();
		this.setState({accounts: accounts});
		if(this.props.summary.locked) {
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
							squareAddress={this.props.squareAddress}
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
			address != SquaresDetail.nullAddress);

		const countSquaresTaken = squaresTaken.length;
		// TODO Does this ever return multiple accounts?
		const countSquaresYouBought = this.props.squareSelections.filter(address => 
			address == this.state.accounts[0]).length;

		const acctName = (this.state.accounts[0]) ? (this.state.accounts[0].substr(2,4) ) : "none";

		const totalAccounts = (	new Set(squaresTaken)).size;
		const squaresLeft = 100 - squaresTaken;
		const items = [

	   {
        header: (SquaresDetail.entryPriceInEther + "/$" + 3000*SquaresDetail.entryPriceInEther) ,
        description: 'Entry price (in ether)',
     	},
	   {
        header: countSquaresTaken,
        description: 'Squares Taken'
     	},
		{
        header: (SquaresDetail.entryPriceInEther * countSquaresTaken + "/$" + 
        	3000 * SquaresDetail.entryPriceInEther * countSquaresTaken),
        description: 'Total at stake (in ether)'
     	},
      {
        header: countSquaresYouBought,
        description: 'Your entries (account ' + acctName + '...)',
        style: {overflowWrap: 'break-word'}
      },
  		{
        header: 
        	(SquaresDetail.entryPriceInEther * countSquaresYouBought + "/$" + 
        	3000 * SquaresDetail.entryPriceInEther * countSquaresYouBought),
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
			(<div suppressHydrationWarning>Ethereum wallet detected (Use Rinkeby Test Network) ✅</div>)
			: (<div suppressHydrationWarning>Ethereum wallet not detected (Use Rinkeby Test Network) ❌.  Check out <a href="http://metamask.io">Metamask</a> or similar</div>);

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

export default SquaresDetail;
