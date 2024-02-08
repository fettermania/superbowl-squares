import React, {Component} from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';

import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link, Router }  from '../routes';
import web3 from '../ethereum/web3';

var config = require ('../ethereum/config.js');

class SquaresNew extends Component {

	state = {
 		squarePrice: '', // user input is usually a string
 		competitionName: '',
 		homeName: '',
 		awayName: '',
 		errorMessage: '',
 		loading: false
	};

	// NOTE: Gotcha - need the arrow function for THIS to work.
	onSubmit = async (event) => {
		event.preventDefault(); // NOTE - prevent HTML1 form submittal

		try  {
			const accounts = await web3.eth.getAccounts();
			this.setState({loading: true,
							errorMessage: ''});
			// TODO: take :network out of the URL instead of hardcoding 'goerli'
			const myFactory = factory(config.factoryAddresses['goerli']);

			await myFactory.methods.createSquare(
				this.state.competitionName,
				this.state.homeName,
				this.state.awayName,
				this.state.squarePrice)
				.send({
					from: accounts[0] // TODO  
				});

				// NOTE: Redirect back to index route after completon.
				Router.pushRoute('/');

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
			this.setState({loading: false});
			this.setState({errorMessage: humanMessage});
		}
	};

	render(){
		// NOTE: Form ... error prop needed to show error message
		// NOTE: !!foo is equivalent to Boolean(foo)
		return (
			<Layout>
				<h3>Create a Square</h3>
				<Form onSubmit={this.onSubmit} error={Boolean(this.state.errorMessage)}>
					<Form.Field>
						<label>Competition Name</label>
						<Input 
							labelPosition="right" 
							value={this.state.competitionName}
							onChange={event => this.setState({competitionName: event.target.value})} />
					</Form.Field>
					<Form.Field>
						<label>Home Team Name</label>
						<Input 
							labelPosition="right" 
							value={this.state.homeName}
							onChange={event => this.setState({homeName: event.target.value})} />
					</Form.Field>
					<Form.Field>
						<label>Away Team Name</label>
						<Input 
							labelPosition="right" 
							value={this.state.awayName}
							onChange={event => this.setState({awayName: event.target.value})} />
					</Form.Field>
					<Form.Field>
						<label>Square Price</label>
						<Input 
							label="wei" 
							labelPosition="right" 
							value={this.state.squarePrice}
							onChange={event => this.setState({squarePrice: event.target.value})} />
					</Form.Field>
					<Message error header="Oops!" content={this.state.errorMessage} />
					<Button loading={this.state.loading} primary>Create</Button>
				</Form>
			</Layout>
		);
	}
}
export default SquaresNew;
