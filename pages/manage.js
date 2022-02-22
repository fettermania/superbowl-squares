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
 		errorMessage: ''
	};

	onLockChange = async () => {
		const square = squaremodel(this.props.squareAddress);
		try { 

			this.setTopError('');
			this.setState({lockedLoading: true});

			await square.methods.setLocked(!this.props.summary.locked)
				.send({
					from: this.state.accounts[0]
				});				

			// TODO Just let refresh take care of it
			this.setState({lockedLoading: false});
			this.setGamesLockedState(!this.props.summary.locked);

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
				this.setState({lockedLoading: false});
				this.setTopError(humanMessage);
		}
	}

	static async getInitialProps(props) {

		// TODO How can we pass the object instead of just the address?
		const squareAddress = props.query.address;
		const square = squaremodel(props.query.address);
		const summaryRaw = await square.methods.getSummary().call();
		console.log("SUMMARY RAW");
		console.log(summaryRaw);
		const summary = {
			competitionName: summaryRaw[0],
          	manager: summaryRaw[2],
		  	locked: summaryRaw[3]
		}
		// sugar for  { squareSelections : squareSelections}
		return {squareAddress, summary};  
	}

	// TODO Consolideate getInitialProps and compoentnDidMount?
	async componentDidMount() {
		const accounts = await web3.eth.getAccounts();
		if (this.props.summary.manager !== accounts[0]) {
		 	Router.pushRoute(`/squares/${this.props.squareAddress}`);
		 } 
		this.setState({accounts: accounts});
		this.setGamesLockedState(this.props.summary.locked);
	}
	
	setTopError = (errorMessage) => {
        this.setState({errorMessage: errorMessage});
    }
    
	setGamesLockedState(state) {
		if (state) {
			this.setState({errorMessage: 'Games are locked', locked: false});
		} else {
			this.setState({errorMessage: '', locked: false});
		}
	}

	// // NOTE: Gotcha - need the arrow function for THIS to work.
	// onSubmit = async (event) => {
	// 	event.preventDefault(); // NOTE - prevent HTML1 form submittal

	// 	try  {
	// 		const accounts = await web3.eth.getAccounts();
	// 		this.setState({loading: true,
	// 						errorMessage: ''});


	// 		await factory.methods.createSquare(
	// 			this.state.competitionName,
	// 			this.state.squarePrice)
	// 			.send({
	// 				from: accounts[0] // TODO  
	// 			});

	// 			// NOTE: Redirect back to index route after completon.
	// 			Router.pushRoute('/');

	// 	} catch (err) {
	// 		console.log("GOT ERROR ON CREATE");
	// 		console.log(JSON.stringify(err));
	// 		let humanMessage;

	// 		// NOTE: Fetterman wrote this sugar.
	// 		switch (err.code) {
	// 			case 'INVALID_ARGUMENT':
	// 				humanMessage = "Something wrong with the input";
	// 				break;
	// 			case 4001:
	// 				humanMessage = "Transaction rejected by metamask/provider";
	// 				break;
	// 			default:
	// 				humanMessage = "Unknown error.  Details:" + err.message;
	// 		}
	// 		this.setState({loading: false});
	// 		this.setState({errorMessage: humanMessage});
	// 	}
	// };

	// render(){

	// 	return (
	// 		<Layout>
	// 			<h3>Management for Square: </h3>
	// 			<Form onSubmit={this.onSubmit} error={Boolean(this.state.errorMessage)}>
	// 				<Form.Field>
	// 					<label>Home Score</label>
	// 					<Input 
	// 						labelPosition="right" 
	// 						value={this.state.homeScore}
	// 						onChange={event => this.setState({homeScore: event.target.value})} />
	// 				</Form.Field>
	// 				<Form.Field>
	// 					<label>Away Score</label>
	// 					<Input 
	// 						labelPosition="right" 
	// 						value={this.state.awayScore}
	// 						onChange={event => this.setState({awayScore: event.target.value})} />
	// 				</Form.Field>
	// 				<Message error header="Oops!" content={this.state.errorMessage} />
	// 				<Button loading={this.state.loading} primary>Declare Winner</Button>
	// 			</Form>
	// 		</Layout>
	// 	);
	// }

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
				 <Message error hidden={!Boolean(this.state.errorMessage)} content={this.state.errorMessage} />
  				{this.renderLockButton()}
				</Layout>
				);
	}
}
export default SquaresManager;
