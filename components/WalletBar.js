import React, {Component} from 'react';
import { Menu, Message } from 'semantic-ui-react';
import { Link } from '../routes';
import { makeWeb3 } from '../ethereum/web3';

class WalletBar extends Component {

  state = {
    message: 'Ethereum wallet not detected.   Check out metamask.io or similar',
    className: 'error'
  };


  async onChainDetect(chainId) {
    var message;
    var className;
    if (chainId === 5) {
      message = "Ethereum wallet detected.  Use Goerli Test Network above.";
      className = 'positive';
    } else if (chainId === 1) { 
      message = "Ethereum wallet detected.  Use Mainnet above.";
      className = 'positive';
    } else {
      message = "Ethereum wallet detected.  Log in and switch to Goerli or Mainnet.";
      className = 'error';
    }
    this.setState({message: message, className: className});
  }

  async componentDidMount() {
    var boundDetect = this.onChainDetect.bind(this);
     if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        const myWeb3 = makeWeb3(null); 
        myWeb3.eth.getChainId().then(boundDetect);
      }
  } 

  render () {
    return <Message className={this.state.className} content={this.state.message} />
  }
};

export default WalletBar; 