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

	$ node deploy.js

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
- 1/18: Where are all my requests coming from?  NOTE: Public infura keys often get abused.   Would need a server component to hide.
- Remember: "npm compile.js" to ensure the client side of the ABI/contract is handled in build/.
- Make Squares (Better idea)
  - Principle: Code and Contract are there for everyone to see and behind no servers.
  - Principle: True values of columns and rows are hidden during buying (otherwise value unequal)
  - Principle: Even the creator of the grid can't know the values before locking the scoring.
  - [DONE] (locked == true) --> (lockedTimestamp != 0)
  - [DONE] setLocked(bool) -> setLocked()
  - [DONE] Use block.timestamp for  random seed on create
  - [DONE] Return block.lockedTimestamp  in getSummary
  - [DONE] Use that seed to generate sequence on client using JS
  - [DONE] Make Lock one-way in UI
  - [DONE] Move completed to int (-1: game incomplete, 0-99: Row/col)
  - [DONE] Store winner in completed
  - [DONE] Show basic winner in show.js
  - [DONE] Only Show Lock or Declare winner on manager page on respective conditions !locked, locked
  - [DONE] Display 0-9 re-mapping on game page
  - [DONE] Translate 0-9 winner to which row/col to pick on manager page
- [DONE] Store actual final scores, refactor completed away somehow (two bytes)
- Goerli vs. Mainnet
  - Routes: include network in URL like /:network/:address
  - Routes: if no network in URL, redirect to prod 
  - Banner: Encourage user to switch network if it doesn't match URL
    - [TODO] Any bug handling with wallet not logged in, etc.
  - Mapping of network  to known provider, factory singleton 
  - [TODO] Set routes for prod / test and keep there.
  - [TODO] Release testnet transaction for championship games.
  - [TODO] Deploy final contract on prod
  - [TODO] Add a link to the object on etherscan
  - Node scripts  (deploy, compile) to take network as well
- Explain
  - [TODO] Explain the rules
  - [TODO] Highlight winner in a better way.
  - Explain the contract
- [DONE] Hover to show opponent ID on show.js
- Somehow keep the url squares.fettermania.com
- Probably write some tests here.
- [DONE] Make cheaper:
  - Monday at 7 PM: about $1 for square buy, lock about $.80, new square $18.75, new factory $23.00
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
