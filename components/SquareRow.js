import React, {Component} from 'react';
import { Button, Table, Grid, Card} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import SquareCell from './SquareCell';

// TODO note: BUG - same account can contribute more than once, 
// 	counting them as two contributors
class SquareRow extends Component {
	
	render() {
		const rowContent = this.props.rowBuyerAddresses.map((buyerAddress, index) => {
			return (<SquareCell 
					row={this.props.row}
					col={index}
					key={index}
					buyerAddress={buyerAddress}
					viewerAddress={this.props.viewerAddress} />);
				});

		return (
			<Grid.Row stretched height={2}>
				<Grid.Column width={1}>
					<Card>{this.props.row}</Card>
				</Grid.Column>
				{rowContent}

			</Grid.Row>)
	}
}

export default SquareRow;

