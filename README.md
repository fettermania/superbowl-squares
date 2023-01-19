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
  - Probably write some tests here.
  - [DONE] Move completed to int (-1: game incomplete, 0-99: Row/col)
  - [DONE] Store winner in completed
  - Show winner in show.js
  - Display 0-9 hash on game page
  - Translate 0-9 winner to which row/col to pick
- [WON'T DO] Make Squares Random from seed
  - Principle: If you have the code, the contract, and the ID of the creator, you still can't get the order.
  - Principle: The order has to be shown to be selected when the squares start.
  - Principle: The creator needs to know the order.  (Imagine you're making the posterboard in analogue version)
  - Generate (creator page)
     - Get timestamp seed
     - Button: Get timestamp seed, Generate two random 0-9 lists, and an md5.  Note to save the lists.
     - Spit the lists out to the owner and populate md5 in the create
  - In solidity: Add a byte8[20] and md5 hash
  - setLocked() -> startGame(byte8[10], byte8[10]).  Reject if not the same seed.  
  - locked => gameStarted
  - Display hash on game page.
  - Update game page to show correct numbers on row and column.
  - PickWinner uses row and column, not score.  So update Pick page to set final score, do logic in JS.
- Show prices in ether, not wei
- Hover to show opponent ID on show.js
- Set routes for prod / test and keep there.
- Finished page: Winner icon, 
- Add a link to the object on etherscan
- Somehow keep the url squares.fettermania.com
- [MAYBE] Make cheaper: Note: Interacting with contract (even making selection) on Mainnet seems to be about .02 ether ~= $25, so no go there.
- [WON'T DO] Generally, most of the non-financial state should be moved to a database, not the contract
- [WON'T DO] Web3 is depreacted: https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3
- [WON'T DO] Detect swiching accounts
- [WON't DO] Detect updates in state from "server" 
- [WON'T DO] How do I open metamask right away when visiting the app?

### Props

To <a href="https://github.com/StephenGrider/">Stephen Grider</a>'s <a href="https://www.udemy.com/course-dashboard-redirect/?course_id=1466612">Udemy course on Solidity</a> for laying the foundation.  Note that it was published in 2019 so it may be dated.
