import React, {Component} from 'react';
import { Card, Button, Grid, Message, Image, Icon, Label } from 'semantic-ui-react';

import SquareRow from '../components/SquareRow';
import squaremodel from '../ethereum/squaremodel';
//import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link, Router }  from '../routes';
import { makeWeb3 } from '../ethereum/web3.js';
import {generateEtherscanURL} from '../lib/networkstring.js';
import Web3 from "web3";


class SquaresDetail extends Component {
	// TODO move these
	static nullAddress = '0x0000000000000000000000000000000000000000';

	state = {
		accounts: [], // TODO Gross global variable
		errorMessage: '',
		isCompleted: false,
		isLocked: false,
		lockedLoading: false,
		myWeb3: null,
		summary: {
			competitionName: '',
			homeName: '',
			awayName: '',
			squarePrice: 0,
          	manager: '',
          	lockedTimestamp: 0, // TODO Note: 0 for now locked, otherwise timestamp
      	    isLocked: false,
			homeScore: 0,
          	awayScore: 0,
          	isCompleted: 0,
		},
		squareSelections : [],
		rows : []
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


	static async getInitialProps(props) {

		var network = props.query.network;
		var squareAddress=props.query.address;

		return {network, squareAddress};
	}

	setGameProgressState(isLocked, isCompleted) {
		if (isCompleted == true) {
			var homescore = this.state.summary.homeScore;
			var awayscore = this.state.summary.awayScore;
			var winneraddress = this.state.squareSelections[(homescore%10)*10+(awayscore%10)];
			var completedMessage = "Contest completed. "
				+  this.state.summary.awayName + " scores " + awayscore + ". "
				+  this.state.summary.homeName + " scores " + homescore + "."
			var winnerMessage = (winneraddress == SquaresDetail.nullAddress) ? " No winner. Refunds dispensed." : " Winner is " + winneraddress + ".";		
			this.setState({errorMessage: completedMessage + winnerMessage, isLocked: true, isCompleted: true});
		} else if (isLocked) {
			this.setState({errorMessage: 'Choices are locked', isLocked: true, isCompleted: false});
		} else {
			this.setState({errorMessage: '', isLocked: false, isCompleted: false});
		}
	}
	// TODO 1/25 - need web3 here
	async componentDidMount() {
		try { 
			const myWeb3 = makeWeb3(this.props.network);
			const square = squaremodel(this.props.squareAddress, myWeb3);
			const summaryRaw = await square.methods.getSummary().call();

			console.log("Raw Summary")
			console.log(summaryRaw)
			const parsedTimestamp = parseInt(summaryRaw[5]);
			const squareSelections = await square.methods.getSelectors().call();
	//		const squareSelections = summaryRaw[9];
			const rows = SquaresDetail.selectionsTo2D(squareSelections);
			

			const summary = {
				competitionName: summaryRaw[0],
				homeName: summaryRaw[1],
				awayName: summaryRaw[2],
				squarePrice: summaryRaw[3],
				manager: summaryRaw[4],
				lockedTimestamp: parsedTimestamp, // TODO Note: 0 for now locked, otherwise timestamp
				isLocked: parsedTimestamp > 0,
				homeScore: summaryRaw[6],
				awayScore: summaryRaw[7],          	
				isCompleted: summaryRaw[8],
				//hiddenAxes: hiddenAxes,

			}

		const accounts = await myWeb3.eth.getAccounts();
		const walletDetected = (typeof window !== "undefined" && typeof window.ethereum !== "undefined");
			this.setState({accounts: accounts,
			walletDetected: walletDetected,
				summary: summary,
				rows: rows,
				squareSelections: squareSelections});
			this.setGameProgressState(summary.isLocked, summary.isCompleted);
		}  catch (e) {
		Router.push('/');
  	  }
	}

	setTopError = (errorMessage) => {
        this.setState({errorMessage: errorMessage});
    }

    renderManagerButton() {

    	if (this.state.summary.manager == this.state.accounts[0]
    		&& (this.state.summary.isCompleted == false)) {
			return (
  	  		<div>
  	  			<p/>
					<Link route={`/squares/${this.props.network}/${this.props.squareAddress}/manage`}>
					 		<Button 
					 			color="red"
					 			floated="right"
					 			content="Manage"/>	    					
			 		</Link>
		 		</div>);
    	} else {
    		return '';
    	}	
    }

    renderKey() {
    		return (
    		<Grid>
    		<Grid.Column width={8}>
    	  <Button.Group vertical labeled icon>
  		    <Button icon='user secret' color='red' content='Opponent' data-tooltip="0x0pponentAddress" />
		    <Button icon='user' disabled color='blue' content='You' />
		    <Button icon='chevron down' color='black' content='Home' />
		    </Button.Group>
		    </Grid.Column>
		    <Grid.Column width={8}>
    	  <Button.Group vertical labeled icon>
		    <Button icon='x' disabled color='grey' content='Locked' />
		    <Button icon='ethereum'  color='green' content='Open' />
		    <Button icon='chevron left' color='grey' content='Away' />
		    </Button.Group>
		    </Grid.Column>
		    </Grid>
  		 );
    }

 
	renderRows() {
		return this.state.rows.map((rowSelections, index) => {
			return (<SquareRow 
							key={index}
							row={index}
							network={this.props.network}
							squareAddress={this.props.squareAddress}
							squarePrice={this.state.summary.squarePrice}
							isLocked={this.state.summary.isLocked}
							isCompleted={this.state.summary.isCompleted}
							rowBuyerAddresses={rowSelections}
							viewerAddress={this.state.accounts[0]}
							setTopError={this.setTopError} // 2024 new
							/>);
		});
	}

	renderSquareGrid() {
		// TODO Fix index to hidden - 1/18
		// TODO Fix this hardcoded nonsense
		const headerContent = Array(10).fill().map(
			(n, index) => {
				return <Grid.Column color="grey" key={index}>{index}</Grid.Column>; }
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
		const squaresTaken = this.state.squareSelections.filter(address => 
			address != SquaresDetail.nullAddress);

		const countSquaresTaken = squaresTaken.length;
		// TODO Does this ever return multiple accounts?
		const countSquaresYouBought = this.state.squareSelections.filter(address => 
			address == this.state.accounts[0]).length;

		const acctName = (this.state.accounts[0]) ? (this.state.accounts[0].substr(2,4) ) : "none";

		const totalAccounts = (	new Set(squaresTaken)).size;
		const squaresLeft = 100 - squaresTaken;
		const items = [

	   {
        header: Web3.utils.fromWei(this.state.summary.squarePrice.toString()),
		description: 'Entry price (in eth)',
     	},
	   {
        header: countSquaresTaken,
        description: 'Squares Taken'
     	},
		{
			header: Web3.utils.fromWei((this.state.summary.squarePrice * countSquaresTaken).toString()),
			description: 'Total at stake (in eth)'
     	},
      {
        header: countSquaresYouBought,
        description: 'Your entries (account ' + acctName + '...)',
        style: {overflowWrap: 'break-word'}
      },
  		{
			header: Web3.utils.fromWei((this.state.summary.squarePrice * countSquaresYouBought).toString()),
			description: 'Your total stake (in eth)'
     	},
       {
        header: totalAccounts,
        description: 'Total Players'
    	}
    ];

  		return (<Card.Group items={items} />);

	}

	render () {
	const installText = this.state.walletDetected ?
			(<div suppressHydrationWarning>Ethereum wallet detected (Use Goerli Test Network) ✅</div>)
			: (<div suppressHydrationWarning>Ethereum wallet not detected (Use Goerli Test Network) ❌.  Check out <a href="http://metamask.io">Metamask</a> or similar</div>);

		return (<Layout network={this.props.network}>		  	
		  	{this.renderManagerButton()}
			<h2>{this.state.summary.competitionName}</h2>
			<h3>{this.state.summary.awayName} <em>(Away)</em> at {this.state.summary.homeName} <em>(Home)</em></h3>
			
		   <h4><em>{installText}</em></h4>
			<Message error hidden={!Boolean(this.state.errorMessage)} content={this.state.errorMessage} />
		  	<p/>
		  	{this.renderKey()}
  			<p/>
		  	{this.renderSquareGrid()}
			
		  	<h3>Stats</h3>
  			{this.renderStatsBlock()}
			
 		</Layout>);
	}
}

export default SquaresDetail;
