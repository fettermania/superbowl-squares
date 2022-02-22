import React, {Component} from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import squaremodel from '../ethereum/squaremodel';

import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link, Router }  from '../routes';
import web3 from '../ethereum/web3';

		    		 

class SquaresManager extends Component {

	state = {
 		homeScore: '',
 		awayScore: '',
 		locked: false,
 		accounts: [],
 		errorMessage: '',
 		lockedLoading: false,
 		winnerLoading: false
	};

	onLockChange = async () => {
		const square = squaremodel(this.props.squareAddress);
		try { 

			this.setState({errorMessage: '', lockedLoading: true});

			await square.methods.setLocked(!this.props.summary.locked)
				.send({
					from: this.state.accounts[0]
				});				

			// TODO Just let refresh take care of it
			this.setState({lockedLoading: false, 
				locked: !this.props.summary.locked,
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
		const summary = {
			competitionName: summaryRaw[0],
			homeName: summaryRaw[1],
			awayName: summaryRaw[1],
          	manager: summaryRaw[4],
		  	locked: summaryRaw[5],
		  	completed: summaryRaw[6]
		}
		// sugar for  { squareSelections : squareSelections}
		return {squareAddress, summary};  
	}

	async componentDidMount() {
		const accounts = await web3.eth.getAccounts();
		if ((this.props.summary.manager !== accounts[0])
			|| this.props.summary.completed) {
		 	Router.pushRoute(`/squares/${this.props.squareAddress}`);
		 } 
		this.setState({accounts: accounts, locked: this.props.summary.locked});
	}
	    

	// NOTE: Gotcha - need the arrow function for THIS to work.
	onPickWinner = async (event) => {
		event.preventDefault(); // NOTE - prevent HTML1 form submittal

		const square = squaremodel(this.props.squareAddress);

		try  {
			this.setState({errorMessage: '', winnerLoading: true});
			await square.methods.pickWinner(
				this.state.homeScore % 10,
				this.state.awayScore % 10)
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

	renderLockButton() {
		const buttonText = (this.props.summary.locked) ? "Unlock" : "Lock";
        return (
             <Button
                loading={this.state.lockedLoading} 
                                        basic 
                                        color="red" 
                                        onClick={this.onLockChange}>{buttonText} </Button>
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
