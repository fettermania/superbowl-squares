import React, {Component} from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';
import { makeWeb3 } from '../ethereum/web3';

class WalletBar extends Component {

  state = {
    message: 'Ethereum wallet not detected ❌.   Check out metamask.io or similar',
    color: 'red'
  };


  async onChainDetect(chainId) {
    var message;
    var color;
    if (chainId === 5) {
      message = "Ethereum wallet detected.  Use Goerli Test Network above. ✅";
      color = 'green';
    } else if (chainId === 1) { 
      message = "Ethereum wallet detected.  Use Mainnet above. ✅";
      color = 'green';
    } else {
      message = "Ethereum wallet detected.  Log in and switch to Goerli or Mainnet. ❌";
      color = 'red';
    }
    this.setState({message: message, color: color});
  }

  async componentDidMount() {
    var boundDetect = this.onChainDetect.bind(this);
     if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        const myWeb3 = makeWeb3(null); 
        myWeb3.eth.getChainId().then(boundDetect);
      }
  } 

  render () {
    return <h4><em><div suppressHydrationWarning style={{color: this.state.color}}>{this.state.message}</div></em></h4>;
  }
};

export default WalletBar; 