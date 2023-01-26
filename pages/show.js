import React, {Component} from 'react';
import { Card, Button, Grid, Message, Image, Icon, Label } from 'semantic-ui-react';

import SquareRow from '../components/SquareRow';
import squaremodel from '../ethereum/squaremodel';
import Layout from '../components/Layout';
import { Link, Router }  from '../routes';
import { makeWeb3 } from '../ethereum/web3.js';
import {positionToScoreFromSeed, scoreToPositionFromSeed} from '../lib/hiddenaxes.js';
import {generateEtherscanURL} from '../lib/networkstring.js';

class SquaresDetail extends Component {
	// TODO move these
	static nullAddress = '0x0000000000000000000000000000000000000000';

	static defaultHiddenAxes = [Array(10).fill('?'), Array(10).fill('?')];

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
          	hiddenAxes: SquaresDetail.defaultHiddenAxes
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


	// NOTE Note: getInitialProps is a nextJS thing for server only!
	// NOTE Use componentDidMount (a react thing)
	setGameProgressState(isLocked, isCompleted) {
		if (isCompleted) {
			var scoreToPositionFromSeedMaps = scoreToPositionFromSeed(this.state.summary.lockedTimestamp);
			var winnerHomeIndex = scoreToPositionFromSeedMaps[0][this.state.summary.homeScore % 10];
			var winnerAwayIndex = scoreToPositionFromSeedMaps[1][this.state.summary.awayScore % 10];
			var winnerAddr = this.state.squareSelections[winnerHomeIndex * 10 + winnerAwayIndex];		
			if (winnerAddr == "0x0000000000000000000000000000000000000000") {
				winnerAddr = "None (purchases refunded)."
			}
			this.setState({errorMessage: 'Contest completed.  Home score: ' 
				+ this.state.summary.homeScore 
				+ ', Away Score: ' 
				+  this.state.summary.awayScore 
				+ ', Winner: ' + winnerAddr, 
				isLocked: true, isCompleted: true});
		} else if (isLocked) {
			this.setState({errorMessage: 'Choices are locked', isLocked: true, isCompleted: false});
		} else {
			this.setState({errorMessage: '', isLocked: false, isCompleted: false});
		}

	}

	
	async componentDidMount() {
	
		const myWeb3 = makeWeb3(this.props.network);
		const square = squaremodel(this.props.squareAddress, myWeb3);
		const summaryRaw = await square.methods.getSummary().call();

		const parsedTimestamp = parseInt(summaryRaw[5]);
		var hiddenAxes;
		if (parsedTimestamp == 0) {
			hiddenAxes = SquaresDetail.defaultHiddenAxes;
		} else {
			hiddenAxes = positionToScoreFromSeed(parsedTimestamp);
		}

		const squareSelections = summaryRaw[9];
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
          	hiddenAxes: hiddenAxes,

		}

       const accounts = await myWeb3.eth.getAccounts();
	   const walletDetected = (typeof window !== "undefined" && typeof window.ethereum !== "undefined");
		this.setState({accounts: accounts,
		   walletDetected: walletDetected,
			summary: summary,
			rows: rows,
			squareSelections: squareSelections});
		this.setGameProgressState(summary.isLocked, summary.isCompleted);
	}

	setTopError = (errorMessage) => {
        this.setState({errorMessage: errorMessage});
    }

	// TODO Add score selection
	// TODO Add status on list page
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
		    <Button icon='ethereum'  basic color='green' content='Open' />
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
							displayRow={this.state.summary.hiddenAxes[0][index]}
							squareAddress={this.props.squareAddress}
							squarePrice={this.state.summary.squarePrice}
							isLocked={this.state.summary.isLocked}
							isCompleted={this.state.summary.isCompleted}
							setTopError={this.setTopError.bind(this)}
							rowBuyerAddresses={rowSelections}
							viewerAddress={this.state.accounts[0]}
							/>);
		});
	}

	renderSquareGrid() {
		// TODO LATER Fix this hardcoded 10 nonsense
		const headerContent = Array(10).fill().map(
			(n, index) => {
				return <Grid.Column color="grey" key={index}>{this.state.summary.hiddenAxes[1][index]}</Grid.Column>; }
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
        header: this.state.summary.squarePrice,
        description: 'Entry price (in wei)',
     	},
	   {
        header: countSquaresTaken,
        description: 'Squares Taken'
     	},
		{
        header: (this.state.summary.squarePrice * countSquaresTaken),
        description: 'Total at stake (in wei)'
     	},
      {
        header: countSquaresYouBought,
        description: 'Your entries (account ' + acctName + '...)',
        style: {overflowWrap: 'break-word'}
      },
  		{
    header:this.state.summary.squarePrice * countSquaresYouBought,
        description: 'Your total stake (in wei)'
     	},
       {
        header: totalAccounts,
        description: 'Total Players'
    	}
    ];

  		return (<Card.Group items={items} />);

	}


	render () {
		return (<Layout>
		  	{this.renderManagerButton()}
			<h2>{this.state.summary.competitionName}</h2>
			<h3>{this.state.summary.awayName} <em>(Away)</em> at {this.state.summary.homeName} <em>(Home)</em></h3>
			<a href={generateEtherscanURL(this.props.squareAddress, this.props.network)}>(etherscan link)</a>

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
