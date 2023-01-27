import React, {Component} from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import squaremodel from '../ethereum/squaremodel';

import Layout from '../components/Layout';
import { Link, Router }  from '../routes';
import { makeWeb3 } from '../ethereum/web3';
import {positionToScoreFromSeed, scoreToPositionFromSeed} from '../lib/hiddenaxes.js';

                     

class SquaresManager extends Component {

    state = {
        homeScore: '',
        awayScore: '',
        isLocked: false,
        accounts: [],
        errorMessage: '',
        lockedLoading: false,
        winnerLoading: false,
        summary: {
            competitionName: '',
            homeName: '',
            awayName: '',
            squarePrice: 0,
            manager: '',
            lockedTimestamp: 0, // TODO Note: 0 for now locked, otherwise timestamp
            isLocked: false,
            homeScore: 0,
            awayScore: 0,
            isCompleted: 0,
            // hiddenAxes: [] // not needed here 
        },
    };

    // TODO: Do we have to getSummary here?
    onLock = async () => {
        const myWeb3 = makeWeb3(this.props.network);
        const square = squaremodel(this.props.squareAddress, myWeb3);
        try { 

            this.setState({errorMessage: '', lockedLoading: true});

            await square.methods.setLocked()
                .send({
                    from: this.state.accounts[0]
                });             

            // TODO Just let refresh take care of it
            this.setState({lockedLoading: false, 
                isLocked: true,
                erroMessage: ''});

            // NOTE: Back to detail page on change
            // TODO Completed message on detail page
            Router.pushRoute(`/squares/${this.props.network}/${this.props.squareAddress}`);

        } catch (err)   {
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
                this.setState({errorMessage: humanMessage, lockedLoading: false});
        }
    }

    static async getInitialProps(props) {

    
        // TODO How can we pass the object instead of just the address?
        const network = props.query.network;
        const squareAddress = props.query.address;

        // sugar for  { squareSelections : squareSelections}
        return {squareAddress, network};

    }

    async componentDidMount() {

      try { 
        const myWeb3 = makeWeb3(this.props.network);
    
        const square = squaremodel(this.props.squareAddress, myWeb3);
        const summaryRaw = await square.methods.getSummary().call();

        const parsedTimestamp = parseInt(summaryRaw[5]);
        const summary = {
            competitionName: summaryRaw[0],
            homeName: summaryRaw[1],
            awayName: summaryRaw[2],
            squarePrice: summaryRaw[3],
            manager: summaryRaw[4],
            lockedTimestamp: parsedTimestamp, // TODO Note: 0 for now locked, otherwise timestamp
            isLocked: parsedTimestamp > 0,
            homeScore: summaryRaw[6],
            awayScore: summaryRaw[7],           
            isCompleted: summaryRaw[8]  
        }
        const accounts = await myWeb3.eth.getAccounts();
        
        if ((summary.manager !== accounts[0]) || summary.isCompleted) {
            Router.pushRoute(`/squares/${this.props.network}/${this.props.squareAddress}`);
         } 

         // TODO: is this isLocked necssary or  working?
        this.setState({accounts: accounts, summary: summary, isLocked: summary.isLocked});
      } catch (e) {
            Router.push('/');
        }
    }
        

    // NOTE: Gotcha - need the arrow function for THIS to work.
    onSubmitScore = async (event) => {
        event.preventDefault(); // NOTE - prevent HTML1 form submittal

        // TODO Probably need some error checking here.
        var positionFromScoresMappings = scoreToPositionFromSeed(this.state.summary.lockedTimestamp);
        var homeIndex = positionFromScoresMappings[0][this.state.homeScore % 10];
        var awayIndex = positionFromScoresMappings[1][this.state.awayScore % 10];
        
        const network = this.props.network;
        const myWeb3 = makeWeb3(network);
        const square = squaremodel(this.props.squareAddress, myWeb3);
        
    
        try  {
            this.setState({errorMessage: '', winnerLoading: true});
            await square.methods.submitScore(
                homeIndex,
                awayIndex,
                this.state.homeScore,
                this.state.awayScore)
                .send({
                    from: this.state.accounts[0]
                });

                // NOTE: Redirect back to index route after completon.
                Router.pushRoute(`/squares/${this.props.network}/${this.props.squareAddress}`);

        } catch (err) {
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
            }
            this.setState({errorMessage: humanMessage, winnerLoading: false});
        }
    };

    renderScoreForm(){

        return (
                <Form onSubmit={this.onSubmitScore} error={Boolean(this.state.errorMessage)}>
                    <Button loading={this.state.winnerLoading} primary 
                             disabled={!(this.state.isLocked)}>Declare Winner</Button>
                    <Form.Field>
                        <label>Home Score</label>
                        <Input 
                            labelPosition="right" 
                            value={this.state.homeScore}
                            onChange={event => this.setState({homeScore: event.target.value})} />
                    </Form.Field>
                    <Form.Field>
                        <label>Away Score</label>
                        <Input 
                            labelPosition="right" 
                            value={this.state.awayScore}
                            onChange={event => this.setState({awayScore: event.target.value})} />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage} />
                </Form>
        );
    }

    // TODO Remove this if already Locked
    renderLockButton() {
        if (this.state.isLocked) { return; }
        const buttonText = "Lock and Reveal Grid";
        return (
             <Button
                loading={this.state.lockedLoading} 
                                        basic 
                                        color="red" 
                                        disabled={this.state.isLocked}
                                        onClick={this.onLock}>{buttonText} </Button>
            );  
    }

    render() {
        return (<Layout network={this.props.network}>           
                <h3>Manager Zone for square:  
                    <Link route={`/squares/${this.props.network}/${this.props.squareAddress}`}>
                        {this.state.summary.competitionName}
                    </Link>
                 </h3>
                {this.renderLockButton()}
                {this.renderScoreForm()}
                </Layout>
                );
    }
}
export default SquaresManager;
