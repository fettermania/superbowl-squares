import React, {Component} from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';

import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link, Router }  from '../routes';
import {makeWeb3 } from '../ethereum/web3';

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

	// NOTE: getInitialProps is next js specific, for initial server-side data load
	// Can't use componentDidMount fpr this!
	// Called on server, sent over to cleint
	static async getInitialProps(props) {
		var network = props.query.network;
		return {network};
	}

	// NOTE: Gotcha - need the arrow function for THIS to work.
	onSubmit = async (event) => {
		event.preventDefault(); // NOTE - prevent HTML1 form submittal

		try  {
			var competitionNameTrimmed = this.state.competitionName.trim();
            var homeNameTrimmed = this.state.homeName.trim();
            var awayNameTrimmed = this.state.awayName.trim();

            if ((competitionNameTrimmed.length == 0) 
                || (homeNameTrimmed.length == 0) 
                || (awayNameTrimmed.length == 0)) {
                this.setState({loading: false});
                this.setState({errorMessage: "Something wrong with the input"});
                return;
            }
			const myWeb3 = makeWeb3(this.props.network);
			
			const accounts = await myWeb3.eth.getAccounts();
			this.setState({loading: true,
							errorMessage: ''});

			const myFactory = factory(config.factoryAddresses[this.props.network], myWeb3);
			
			await myFactory.methods.createSquare(
				competitionNameTrimmed,
				homeNameTrimmed,
				awayNameTrimmed,
				this.state.squarePrice * 1000000000000000000)
				.send({
					from: accounts[0] // TODO  
				});

				// NOTE: Redirect back to index route after completon.
				Router.pushRoute(`/list/${this.props.network}`);
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
			<Layout network={this.props.network}>		  	
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
					<label>Square Price (e.g. .001 eth)</label>
						<Input 
							label="eth" 
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
