import React, {Component} from 'react';
import { Card, Button, Grid, Message } from 'semantic-ui-react';

import SquareRow from '../components/SquareRow';
import squaremodel from '../ethereum/squaremodel';
//import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link }  from '../routes';
import web3 from '../ethereum/web3.js';

class SquaresList extends Component {
	// TODO move these

	static async getInitialProps() {

		return {};
	}

	// TODO Getting accounts here - is that bad?
	async componentDidMount() {

	}

	render () {
		return (<Layout>
  			<h3>TODO: List of squares</h3>
 		</Layout>);
	}
}

export default SquaresList;
