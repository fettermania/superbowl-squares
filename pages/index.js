import React, {Component} from 'react';
import { Card, Button, Icon } from 'semantic-ui-react';

import Layout from '../components/Layout';
import WalletBar from '../components/WalletBar';

class SquaresHome extends Component {


    render () {
        return <Layout network="">
        <WalletBar />
        <h2>Superbowl Squares</h2>
        This is an Ethereum-backed version of Superbowl Squares.  Buy a square and see if you win, just like at the water cooler.

        It is completely chain-backed, open, and can be used for non-Superbowl games as well.
        
        <p/>
        <h3>Choosing Goerli (test) or Mainnet (real money)</h3>
            <div className="ui bulleted listf">
                <div className="item">
                    In order to play, install an <strong>Ethereum-compatible Wallet</strong> like <a href="http://metamask.io">MetaMask</a>.
                </div>
                 <div className="item">
                        The top nav buttons <strong>choose a network</strong>, using test ether in the <a href="/list/goerli">Goerli testnet</a>,                       
                        or real ether on the <a href="/list/mainnet">Mainnet</a>.  Set your wallet to your desired network and go from there.
                </div>
                 <div className="item">
                     <strong>Switching wallet users</strong> requires a page refresh.
                </div>  
                 <div className="item">
                    Usually, bad URLs or mismatched wallet settings <strong>send you home (here)</strong>.
                </div>  
            </div>

        <p/>
        <h3>Playing</h3>

            <div className="ui bulleted list">
                <div className="item">
                    The goal of this every winner-take-all game is to <strong>pick the square</strong> corresponding to the correct score ending of some sporting event.  
                    So, picking the square Home (3), Away (7) would win with scores of 13-7, 3-27, 43-77, etc.
                </div>
                <div className="item">
                    The bottom of the game page shows the <strong>entry fee</strong> that all squares in the game share.
                </div>
                <div className="item">
                    Since scores in NFL football are not evenly distributed (3-7 much more likely than 8-8), <strong>the identites of the squares, though fixed,
                    are not revealed until the contest is locked</strong> by the administrator.  Because these seed for the identities generator isn't set  
                    <a href="https://github.com/fettermania/superbowl-squares/blob/main/ethereum/contracts/Square.sol#L75"> until the moment of locking, </a>
                    the adminstrator has no advantage. You maximum distrust crypto kids should be happy.
                </div>
                <div className="item">
                    If the winning square of the sports contest has no owner, <strong>all ticket prices (minus any gas) are refunded.</strong>
                </div>
            </div>

        <h3>Admin</h3>

            <div className="ui bulleted list">
                <div className="item">
                    <b>Create</b> a new set of squares from the blue button on the main page of your network (/list/goerli/ or /list/mainnet/).  
                    Set the price (in wei) and names accordingly.  These cannot be changed (maximum distrust!)
                </div> 
                <div className="item">
                    Creating a contest (and paying to submit it to the chain) <strong>makes you its sole admin</strong>.
                </div>
                <div className="item">
                    <b>Spread the word</b> or don't.  These contests are by design open to all, and all contests appear in the main list for its network.
                </div> 
                <div className="item">
                    <b>Lock entries</b> behind the Manage button (visible to admin only) on the contest page.  There is no specified time for this, but it should happen before the game begins.
                </div> 
                <div className="item">
                    <b>Submit the score</b> when the game has completed.  This either sends the balance of the contract to the winner or refunds all if that square has no owner.
                </div> 
            </div>

        <h3>Etc</h3>

            <div className="ui bulleted list">
                <div className="item">
                    This dApp operates <strong>entirely on the Ethereum blockchain</strong>.  All storage, including metadata, is on-chain.  Identites are provided by your wallet only.
                </div>
                <div className="item">
                    The contracts are <strong>designed to be unchangeable</strong> except for buying squares before lock.  
                    Strings cannot, say, be adjusted from the <em>Bnegals</em> to the <em>Bengals</em>, 
                    for the same reason they can't be adjusted from the <em>Bengals</em> to the <em>Ravens</em>.

                </div>
                <div className="item">
                    This is maintained by <strong>fettermania@gmail.com</strong>.  Hit me up with any questions or problems.  
                </div>
                <div className="item">
                    The gas costs of all non-ticket calls, including game creation, locking, and submitting score, are <strong>paid by the administrator</strong>.  
                    Night and early morning in the US are cheapest.
                    Expect the gas price creating a contest to be $20-30 and buying a square to be $1-2 (on top of the part going into the pot)
                </div>
                <div className="item">
                    <strong>All code and contracts are visible</strong>. The code for everything is <a href="https://github.com/fettermania/superbowl-squares/">on github</a>.  The contracts (e.g. <a href="https://etherscan.io/address/0x6dded5d52d379ba501420b8570c9dc478895198a">this one</a>) are inspectable as well.
                </div>
            </div>


            </Layout>;
    }
}

export default SquaresHome;
