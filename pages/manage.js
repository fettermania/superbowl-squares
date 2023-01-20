import React, {Component} from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import squaremodel from '../ethereum/squaremodel';

import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link, Router }  from '../routes';
import web3 from '../ethereum/web3';
import {indexToLabelFromSeed, labelToIndexFromSeed} from '../lib/hiddenaxes.js';

		    		 

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
		const square = squaremodel(this.props.squareAddress);
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

		// TODO How can we pass the object instead of just the address?
		const squareAddress = props.query.address;
		const square = squaremodel(props.query.address);
		const summaryRaw = await square.methods.getSummary().call();

		const parsedTimestamp = parseInt(summaryRaw[5]);
		const parsedCompleted = parseInt(summaryRaw[6]); // TODO - is this coming back a string because uint is uint256?
		const summary = {
			competitionName: summaryRaw[0],
			homeName: summaryRaw[1],
			awayName: summaryRaw[2],
			squarePrice: summaryRaw[3],
          	manager: summaryRaw[4],
          	lockedTimestamp: parsedTimestamp, // TODO Note: 0 for now locked, otherwise timestamp
      	    completed: parsedCompleted, // TODO Note: -1 for not completed, otherwise the winner
      	    isLocked: parsedTimestamp > 0,
       	    isCompleted: parsedCompleted >= 0   
		}
		// sugar for  { squareSelections : squareSelections}
		return {squareAddress, summary};  
	}

	async componentDidMount() {
		const accounts = await web3.eth.getAccounts();
		if ((this.props.summary.manager !== accounts[0])
			|| (this.props.summary.isCompleted)) {
		 	Router.pushRoute(`/squares/${this.props.squareAddress}`);
		 } 
		this.setState({accounts: accounts, isLocked: this.props.summary.isLocked});
	}
	    

	// NOTE: Gotcha - need the arrow function for THIS to work.
	onPickWinner = async (event) => {
		event.preventDefault(); // NOTE - prevent HTML1 form submittal

		// TODO Probably need some error checking here.
		var squareFromScoresMappings = labelToIndexFromSeed(this.props.summary.lockedTimestamp);
		var homeIndex = squareFromScoresMappings[0][this.state.homeScore % 10];
		var awayIndex = squareFromScoresMappings[1][this.state.awayScore % 10];
		
		
		const square = squaremodel(this.props.squareAddress);

		try  {
			this.setState({errorMessage: '', winnerLoading: true});
			await square.methods.pickWinner(
				homeIndex,
				awayIndex)
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
				<Form onSubmit={this.onPickWinner} error={Boolean(this.state.errorMessage)}>
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
					<Button loading={this.state.winnerLoading} primary>Declare Winner</Button>
				</Form>
		);
	}

	// TODO Remove this if already Locked
	renderLockButton() {
		if (this.state.isLocked) { return; }
		const buttonText = "Lock";
        return (
             <Button
                loading={this.state.lockedLoading} 
                						basic 
                                        color="red" 
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
