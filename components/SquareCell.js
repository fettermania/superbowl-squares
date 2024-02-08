import React, {Component} from 'react';
import { Button, Table, Grid, Card, Icon} from 'semantic-ui-react';
import {makeWeb3 } from '../ethereum/web3';
import squaremodel from '../ethereum/squaremodel';
import { Router } from '../routes';

class SquareCell extends Component {
	
	// TODO move this
	static nullAddress = '0x0000000000000000000000000000000000000000';

	state = {
		loading: false
	};

	onPurchase = async () => {
//		console.log(this.props) // 2024
		if (!this.props.viewerAddress) {
			this.props.setTopError('No viewer address.  Connect your ethereum wallet.');
			return;
		}

		const network = this.props.network;
		const myWeb3 = makeWeb3(network);
		const square = squaremodel(this.props.squareAddress, myWeb3);
		try { 

			this.setState({loading: true});
			this.props.setTopError('');

			await square.methods.makeSelection(this.props.row, this.props.col)
				.send({
					from: this.props.viewerAddress,
					value: String(this.props.squarePrice),
				});	
			this.setState({loading: false, value: ''});
			this.props.setTopError('');

			// TODO: This forces a hard redirect to refresh full state.  
			// This is kind of gross but the full state (in case someoene else is buying)
			// does need to be updated, instead of just one cell's color.
			// TODO 2024 This doesn't work from here but DOES work from Manage flow 
			Router.push(`/squares/${this.props.network}/${this.props.squareAddress}`);
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
				this.setState({loading: false});
				this.props.setTopError(humanMessage);
		}
	}

	// props: row, column, address, buyer address
	render () {
		var button;
		var buyable = (this.props.buyerAddress == SquareCell.nullAddress);
		var boughtByMe = (this.props.buyerAddress == this.props.viewerAddress);
		if (boughtByMe) {
			button = <Button disabled icon color="blue"><Icon name='user'/></Button>
		} else if (!buyable) {
			button = <Button icon data-tooltip={this.props.buyerAddress} data-position="right center" color="red"><Icon name='user secret'/></Button>		
		} else if (this.props.isLocked || this.props.isCompleted) {
			button = <Button disabled icon color="grey"><Icon name='x'/></Button>
		} else {
			button = <Button icon loading={this.state.loading} color="green" onClick={this.onPurchase}>
				<Icon name='ethereum'/></Button>
		}
		return (<Grid.Column width={1} >
			{button}
			</Grid.Column>)
	}
}
export default SquareCell;
