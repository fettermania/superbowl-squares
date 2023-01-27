# superbowl-squares

## Use: Web Browser (Desktop)

Use metamask.io.

## Use: Web Browser (Mobile)

Install the metamask app and go to the site (e.g. fettermania.com/superbowl) and connect.

Note that if developing locally, you may need to update the URL manually, like:
http://192.168.1.177:3000

## Installation

Install the software:

  $ npm install
  $ cd ethereum
  $ node compile.js  # generates output at build/
 
Deploy an instance of the squareFactory contract to the ethereum network.  Two options here.

## Deployment of contract factory


### Option 1: Deploy ethereum contact from command line

Get your 12-word metamask seed phrase and update the environment 
variable $METAMASK_PHRASE with its contents.  

Then: 

  $ node deploy.js mainnet # or
  # node deploy.js goerli # using Infura URLs in ./ethereum/config.js

Write down the address displayed and update ethereum/factory.js with this address.

### Option 2: Deploy ethereum contract from remix.ethereum.org

Copy ethereum/contracs/Square.sol, paste into Remix, and deploy the SquareFactory contract.  
Write down the address displayed and update ethereum/factory.js with this address.


## Running the server

Running locally:

    $ npm run dev

Running prod (e.g. on heroku):

    $ npm run start

Note that next-routes requires us to run "node server.js" instead of "next" or "next start".
Perhaps this is because next-routes works outside of next. (not clear)

Running "next" or "next start" seems to disable any functionality of routes.js.

## Code Deploy commands

- git push heroku main && heroku logs -t
- heroku ps
- heroku ps:scale web=1 # start single web server
- heroku ps:scale web=0 # stop web servers

## Other Details
- Mainnet (single game) contract : 0x58163bbF45c107A796dE2A9D072441F4E7573aC3  - looks dead
- HEROKU instructions: https://devcenter.heroku.com/articles/deploying-nodejs
- Units are in wei.  Typical is 1000000000000000.

### Bugs and TODOs
- [TODO] Release testnet transaction for championship games.
- 1/18: Where are all my requests coming from?  NOTE: Public infura keys often get abused.   Would need a server component to hide.
- Remember: "npm compile.js" to ensure the client side of the ABI/contract is handled in build/.
- [TODO] Deploy final contract on prod
- [TODO] Highlight winner in a better way.
- Somehow keep the url squares.fettermania.com
- Probably write some tests here.
- [WON'T DO] Generally, most of the non-financial state should be moved to a database, not the contract
- [WON'T DO] Web3 is depreacted: https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3
- [WON'T DO] Detect swiching accounts
- [WON't DO] Detect updates in state from "server" 
- [WON'T DO] How do I open metamask right away when visiting the app?

### Props

To <a href="https://github.com/StephenGrider/">Stephen Grider</a>'s <a href="https://www.udemy.com/course-dashboard-redirect/?course_id=1466612">Udemy course on Solidity</a> for laying the foundation.  Note that it was published in 2019 so it may be dated.


### Notes

- Getting network:
 var net =  web3.eth.getChainId();
+  // or web3.eth.net.getId();
https://docs.metamask.io/guide/provider-migration.html#summary-of-breaking-changes