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
					isCompleted={this.props.isCompleted}
					isLocked={this.props.isLocked}
					setTopError={this.props.setTopError}
					squareAddress={this.props.squareAddress}
					squarePrice={this.props.squarePrice}
					buyerAddress={buyerAddress}
					viewerAddress={this.props.viewerAddress} />);
				});

		return (
			// COLOR: Home column
			<Grid.Row >
				<Grid.Column color="black">
					{this.props.row}
				</Grid.Column>
				{rowContent}

			</Grid.Row>)
	}
}

export default SquareRow;

