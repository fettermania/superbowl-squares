import React, {Component} from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';
import { makeWeb3 } from '../ethereum/web3';

class WalletBar extends Component {

  state = {
    message: 'Ethereum wallet not detected ❌.   Check out metamask.io or similar'
  };


  async onChainDetect(chainId) {
    var message = '';
    if (chainId === 5) {
      message = "Ethereum wallet detected (Using Goerli Test Network) ✅";
    } else if (chainId === 1) { 
      message = "Ethereum wallet detected (Using Mainnet) ✅";
    } else {
      message = "Ethereum wallet detected (Switch to Goerli or Mainnet) ❌";
    }
    this.setState({message: message});
  }

  async componentDidMount() {
    var boundDetect = this.onChainDetect.bind(this);
     if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        const myWeb3 = makeWeb3(null); 
        myWeb3.eth.getChainId().then(boundDetect);
      }
  } 

  render () {
    return <h4><em><div suppressHydrationWarning>{this.state.message}</div></em></h4>;
  }
};

export default WalletBar; 