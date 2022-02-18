import React, {Component} from 'react';
import { Button, Table, Grid, Card} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import squaremodel from '../ethereum/squaremodel';
import { Router } from '../routes';

class SquareCell extends Component {
	
	// TODO move this
	static nullAddress = '0x0000000000000000000000000000000000000000';
	static entryPriceInEther = 0.001;	

	state = {
		loading: false
	};

	onPurchase = async () => {
		if (!this.props.viewerAddress) {
			this.props.setTopError('No viewer address.  Connect your ethereum wallet.');
			return;
		}

		const square = squaremodel(this.props.squareAddress);
		try { 

			this.setState({loading: true});
			this.props.setTopError('');

			await square.methods.makeSelection(this.props.row, this.props.col)
				.send({
					from: this.props.viewerAddress,
					value: web3.utils.toWei(String(SquareCell.entryPriceInEther), 'ether')
				});	
			this.setState({loading: false, value: ''});
			this.props.setTopError('');

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
			button = <Button  basic color="blue">YOU</Button>
		} else if (!buyable) {
			button = <Button basic color="grey">{this.props.buyerAddress.substr(2, 4)}</Button>
		} else if (this.props.locked) {
			button = <Button basic color="grey">EMPTY</Button>
		} else {
			button = <Button loading={this.state.loading} basic color="green" onClick={this.onPurchase}>BUY</Button>
		}
		return (<Grid.Column >
			{button}
			</Grid.Column>)
	}

}
export default SquareCell;
