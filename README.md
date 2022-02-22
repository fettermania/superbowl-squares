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

Note that next-routes requires us to run "node servrer.js" instead of "next" or "next start".
Perhaps this is because next-routes works outside of next. (not clear)

Running "next" or "next start" seems to disable any functionality of routes.js.


## Notes

- Mainnet contract: 0x58163bbF45c107A796dE2A9D072441F4E7573aC3
- HEROKU instructions: https://devcenter.heroku.com/articles/deploying-nodejs
- Units are in wei.  Typical is 1000000000000000.
- git push heroku main && heroku logs -t

### Bugs and TODOs

- Web3 is depreacted-is: https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3
- Mobile layout
- Home and away names / colors 
- List indicates status

### Props

To <a href="https://github.com/StephenGrider/">Stephen Grider</a>'s <a href="https://www.udemy.com/course-dashboard-redirect/?course_id=1466612">Udemy course on Solidity</a> for laying the foundation.  Note that it was published in 2019 so it may be dated.
