import React, {Component} from 'react';
import { Card, Button, Grid, Message, Image, Icon, Label } from 'semantic-ui-react';

import SquareRow from '../components/SquareRow';
import squaremodel from '../ethereum/squaremodel';
//import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link, Router }  from '../routes';
import web3 from '../ethereum/web3.js';
import {indexToLabelFromSeed, labelToIndexFromSeed} from '../lib/hiddenaxes.js';

class SquaresDetail extends Component {
	// TODO move these
	static nullAddress = '0x0000000000000000000000000000000000000000';

	state = {
		accounts: [], // TODO Gross global variable
		errorMessage: '',
		isCompleted: false,
		isLocked: false,
		lockedLoading: false
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


	// NOTE Note: getInitialProps is a nextJS thing for server only!
	// NOTE Use componentDidMount (a react thing)
	static async getInitialProps(props) {
		const squareAddress = props.query.address;
		const square = squaremodel(props.query.address);
		const squareSelections =  await square.methods.getSelectors().call();
		const rows = SquaresDetail.selectionsTo2D(squareSelections);
		const summaryRaw = await square.methods.getSummary().call();
		const parsedTimestamp = parseInt(summaryRaw[5]);
		const parsedCompleted = parseInt(summaryRaw[6]); // TODO - is this coming back a string because uint is uint256?
		var hiddenAxes;
		if (parsedTimestamp == 0) {
			hiddenAxes =  [Array(10).fill('?'), Array(10).fill('?')];
		} else {
			hiddenAxes = indexToLabelFromSeed(parsedTimestamp);

		}
		const summary = {
			competitionName: summaryRaw[0],
			homeName: summaryRaw[1],
			awayName: summaryRaw[2],
			squarePrice: summaryRaw[3],
          	manager: summaryRaw[4],
          	lockedTimestamp: parsedTimestamp, // TODO Note: 0 for now locked, otherwise timestamp
      	    completed: parsedCompleted, // TODO Note: -1 for not completed, otherwise the winner
      	    isLocked: parsedTimestamp > 0,
       	    isCompleted: parsedCompleted >= 0,
       	    hiddenAxes: hiddenAxes 
		}

		
		// sugar for  { squareSelections : squareSelections}
		return {squareAddress, squareSelections, rows, summary};  
	}

	setGameProgressState(isLocked, isCompleted) {
		if (isCompleted) {
			var winnerHomeIndex = Math.trunc(this.props.summary.completed / 10);
			var winnerAwayIndex = Math.trunc(this.props.summary.completed % 10);
			
			var homeScore = this.props.summary.hiddenAxes[0][winnerHomeIndex];
			var awayScore = this.props.summary.hiddenAxes[1][winnerAwayIndex];
			var winnerAddr = this.props.squareSelections[winnerHomeIndex * 10 + winnerAwayIndex];		
			if (winnerAddr == "0x0000000000000000000000000000000000000000") {
				winnerAddr = "None (purchases refunded)."
			}
			this.setState({errorMessage: 'Contest completed.  Home score end: ' + homeScore+ ', Away Score end: ' + awayScore + ', Winner: ' + winnerAddr, 
				isLocked: true, isCompleted: true});
		} else if (isLocked) {
			this.setState({errorMessage: 'Choices are locked', isLocked: true, isCompleted: false});
		} else {
			this.setState({errorMessage: '', isLocked: false, isCompleted: false});
		}

	}
	// TODO Getting accounts here - is that bad?
	async componentDidMount() {
		const accounts = await web3.eth.getAccounts();
	   const walletDetected = (typeof window !== "undefined" && typeof window.ethereum !== "undefined");
		this.setState({accounts: accounts,
		   walletDetected: walletDetected});
		this.setGameProgressState(this.props.summary.isLocked, this.props.summary.isCompleted);
	}

	setTopError = (errorMessage) => {
        this.setState({errorMessage: errorMessage});
    }

	// TODO Add score selection
	// TODO Add status on list page
    renderManagerButton() {
    	if (this.props.summary.manager === this.state.accounts[0]
    		&& (this.props.summary.completed == -1)) {
    		return (
  	  		<div>
  	  			<p/>
	    		<Link route={`/squares/${this.props.squareAddress}/manage`}>
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
		    <Button icon='user secret' disabled color='red' content='Opponents' />
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
		return this.props.rows.map((rowSelections, index) => {
			return (<SquareRow 
							key={index}
							row={index}
							displayRow={this.props.summary.hiddenAxes[0][index]}
							squareAddress={this.props.squareAddress}
							squarePrice={this.props.summary.squarePrice}
							isLocked={this.props.summary.isLocked}
							isCompleted={this.props.summary.isCompleted}
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
				return <Grid.Column color="grey" key={index}>{this.props.summary.hiddenAxes[1][index]}</Grid.Column>; }
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
        header: this.props.summary.squarePrice,
        description: 'Entry price (in wei)',
     	},
	   {
        header: countSquaresTaken,
        description: 'Squares Taken'
     	},
		{
        header: (this.props.summary.squarePrice * countSquaresTaken),
        description: 'Total at stake (in wei)'
     	},
      {
        header: countSquaresYouBought,
        description: 'Your entries (account ' + acctName + '...)',
        style: {overflowWrap: 'break-word'}
      },
  		{
    header:this.props.summary.squarePrice * countSquaresYouBought,
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
	const installText = this.state.walletDetected ?
			(<div suppressHydrationWarning>Ethereum wallet detected (Use Goerli Test Network) ✅</div>)
			: (<div suppressHydrationWarning>Ethereum wallet not detected (Use Goerli Test Network) ❌.  Check out <a href="http://metamask.io">Metamask</a> or similar</div>);

		return (<Layout>
		  	{this.renderManagerButton()}
			<h2>{this.props.summary.competitionName}</h2>
			<h3>{this.props.summary.awayName} <em>(Away)</em> at {this.props.summary.homeName} <em>(Home)</em></h3>
			
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
