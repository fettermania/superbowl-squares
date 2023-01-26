import React, {Component} from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import squaremodel from '../ethereum/squaremodel';

import Layout from '../components/Layout';
import { Link, Router }  from '../routes';
import {web3, makeWeb3 } from '../ethereum/web3';
import {positionToScoreFromSeed, scoreToPositionFromSeed} from '../lib/hiddenaxes.js';

		    		 

class SquaresManager extends Component {

	state = {
 		homeScore: '',
 		awayScore: '',
 		isLocked: false,
 		accounts: [],
 		errorMessage: '',
 		lockedLoading: false,
 		winnerLoading: false
	};

	// TODO: Do we have to getSummary here?
	onLock = async () => {

		// TODO 1/25 - need web3 here
		const network = 'goerli'; // TODO 1/25
		const myWeb3 = makeWeb3(network);
		const square = squaremodel(this.props.squareAddress, myWeb3);
		try { 

			this.setState({errorMessage: '', lockedLoading: true});

			await square.methods.setLocked()
				.send({
					from: this.state.accounts[0]
				});				

			// TODO Just let refresh take care of it
			this.setState({lockedLoading: false, 
				isLocked: true,
				erroMessage: ''});

			// NOTE: Back to detail page on change
			// TODO Completed message on detail page
			Router.pushRoute(`/squares/${this.props.squareAddress}`);

		} catch (err) 	{
				let humanMessage;
				switch (err.code) { 
					case 'INVALID_ARGUMENT':
						humanMessage = "Something wrong with the input";
						break;
					case 4001:
						humanMessage = "Transaction rejected by metamask/provider";
						break;
					default:
						humanMessage = "Unknown error.  Details:" + err.message;
						break;
				}
				this.setState({errorMessage: humanMessage, lockedLoading: false});
		}
	}

	static async getInitialProps(props) {

		// TODO 1/25 - need web3 here

		const network = 'goerli'; // TODO 1/25
		const myWeb3 = makeWeb3(network);
	
		// TODO How can we pass the object instead of just the address?
		const squareAddress = props.query.address;
		const square = squaremodel(props.query.address, myWeb3);
		const summaryRaw = await square.methods.getSummary().call();

		const parsedTimestamp = parseInt(summaryRaw[5]);
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
          	isCompleted: summaryRaw[8]  
		}
		// sugar for  { squareSelections : squareSelections}
		return {squareAddress, summary};  
	}

	async componentDidMount() {


		// TODO 1/25 - this one needs to have the window as a provider, yes?

		const network = 'goerli';
		const myWeb3 = makeWeb3(network);

		const accounts = await myWeb3.eth.getAccounts();
		if ((this.props.summary.manager !== accounts[0])
			|| (this.props.summary.isCompleted)) {
		 	Router.pushRoute(`/squares/${this.props.squareAddress}`);
		 } 
		this.setState({accounts: accounts, isLocked: this.props.summary.isLocked});
	}
	    

	// NOTE: Gotcha - need the arrow function for THIS to work.
	onSubmitScore = async (event) => {
		event.preventDefault(); // NOTE - prevent HTML1 form submittal

		// TODO Probably need some error checking here.
		var positionFromScoresMappings = scoreToPositionFromSeed(this.props.summary.lockedTimestamp);
		var homeIndex = positionFromScoresMappings[0][this.state.homeScore % 10];
		var awayIndex = positionFromScoresMappings[1][this.state.awayScore % 10];
		
		// TODO 1/25 - need web3 here

		const network = 'goerli'; // TODO 1/25
		const myWeb3 = makeWeb3(network);
		const square = squaremodel(this.props.squareAddress, myWeb3);
		
	
		try  {
			this.setState({errorMessage: '', winnerLoading: true});
			await square.methods.submitScore(
				homeIndex,
				awayIndex,
				this.state.homeScore,
				this.state.awayScore)
				.send({
					from: this.state.accounts[0]
				});

				// NOTE: Redirect back to index route after completon.
				Router.pushRoute(`/squares/${this.props.squareAddress}`);

		} catch (err) {
			let humanMessage;

			// NOTE: Fetterman wrote this sugar.
			switch (err.code) {
				case 'INVALID_ARGUMENT':
					humanMessage = "Something wrong with the input";
					break;
				case 4001:
					humanMessage = "Transaction rejected by metamask/provider";
					break;
				default:
					humanMessage = "Unknown error.  Details:" + err.message;
			}
			this.setState({errorMessage: humanMessage, winnerLoading: false});
		}
	};

	renderScoreForm(){

		return (
				<Form onSubmit={this.onSubmitScore} error={Boolean(this.state.errorMessage)}>
					<Form.Field>
						<label>Home Score</label>
						<Input 
							labelPosition="right" 
							value={this.state.homeScore}
							onChange={event => this.setState({homeScore: event.target.value})} />
					</Form.Field>
					<Form.Field>
						<label>Away Score</label>
						<Input 
							labelPosition="right" 
							value={this.state.awayScore}
							onChange={event => this.setState({awayScore: event.target.value})} />
					</Form.Field>
					<Message error header="Oops!" content={this.state.errorMessage} />
					<Button loading={this.state.winnerLoading} primary 
					         disabled={!(this.props.summary.isLocked)}>Declare Winner</Button>
				</Form>
		);
	}

	// TODO Remove this if already Locked
	renderLockButton() {
		if (this.state.isLocked) { return; }
		const buttonText = "Lock and Reveal Grid";
        return (
             <Button
                loading={this.state.lockedLoading} 
                						basic 
                                        color="red" 
                                        disabled={this.props.summary.isLocked}
                                        onClick={this.onLock}>{buttonText} </Button>
            );	
	}

	render() {
		return (<Layout>
				<h3>Manager Zone for square:  
					<Link route={`/squares/${this.props.squareAddress}`}>
						{this.props.summary.competitionName}
					</Link>
				 </h3>
  				{this.renderLockButton()}
  				{this.renderScoreForm()}
				</Layout>
				);
	}
}
export default SquaresManager;
