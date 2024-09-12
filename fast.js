const fs = require('fs');
const ethers = require('ethers');
require('colors');

// WebSocket provider for Ethereum
const provider = new ethers.providers.WebSocketProvider(
    'wss://eth-mainnet.g.alchemy.com/v2/yxiWiL20IfU9QFDGpe8ZVGAJZ3-2BH4G'
)

// Read addresses from the file
const addresses = fs
    .readFileSync('hits.txt', 'utf8')
    .split('\n')
    .map((val) => {
        return val.split(',');
    });

// Function to process a single address
async function processAddress(addressData) {
    const address = addressData[0];
    const balance = await provider.getBalance(address);
    return { address, balance, privateKey: addressData[1] };
}

// Main function to process addresses in parallel with a batch of 5
(async () => {
    const numProcesses = 8;

    // Loop through addresses and process them in parallel batches of 5
    for (let i = 0; i < addresses.length; i += numProcesses) {
        const batch = addresses.slice(i, i + numProcesses);

        // Process the batch in parallel using Promise.all
        const results = await Promise.all(batch.map(processAddress));

        // Check the balance after processing and log the result
        results.forEach(({ address, balance, privateKey }) => {
            if (balance.gt(0)) {
                fs.appendFileSync('private-keys.txt', `${address},${privateKey}\n`);
            } else {
                //#console.log(address, 0);
            }  // console.log();
        });
    }
})();
