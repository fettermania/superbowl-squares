const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// NOTE: TODO - don't delete build/ without a successful compile?
const buildPath = path.resolve(__dirname, 'build');

const campaignPath = path.resolve(__dirname, 'contracts', 'Square.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

const output = solc.compile(source, 1).contracts;

// NOTE: how do we get compile errors?
if (Object.keys(output).length == 0) {
    console.log("COMPILE FAILURE");
    throw new Error("Compile Error");
} 

// else continue
fs.removeSync(buildPath);

// create directory if it doesn't exist
fs.ensureDirSync(buildPath); 

// Loop over each contract (Campaign, CampaignFactory) 
for(let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'), // GROSS, change :Square.json to Square.json
        output[contract]
    );
}

