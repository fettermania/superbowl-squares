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
		loading: false,
		errorMessage: ''
	};

	onPurchase = async () => {

		try { 
			this.setState({
					loading: true,
					errorMessage: ''
					});
			await squaremodel.methods.makeSelection(this.props.row, this.props.col)
				.send({
					from: this.props.viewerAddress,
					value: web3.utils.toWei(String(SquareCell.entryPriceInEther), 'ether')
				});	
			this.setState({loading: false, value: ''});
			Router.replaceRoute('/');
		} catch (err) 	{
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
					console.log("GOT ERROR " + humanMessage);
					this.setState({errorMessage: humanMessage});
				}

				// NOTE: Never get here!
			this.setState({loading: false, value: ''});
		}
	}

	// props: row, column, address, buyer address
	render () {
		var button;
		var buyable = (this.props.buyerAddress == SquareCell.nullAddress);
		var boughtByMe = (this.props.buyerAddress == this.props.viewerAddress);
		if (boughtByMe) {
			button = <Button  basic color="blue">Yours</Button>
		} else if (!buyable) {
			button = <Button basic color="grey">{this.props.buyerAddress.substr(0, 6)}</Button>
		} else {
			button = <Button loading={this.state.loading} basic color="green" onClick={this.onPurchase}>BUY</Button>
		}
		return (<Grid.Column width={1}><Card >
			{button}
			</Card>
			</Grid.Column>)
	}

}
export default SquareCell;
