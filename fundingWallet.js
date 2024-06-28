const Web3 = require('web3');
const fs = require('fs');

const infuraUrl = 'https://sepolia.infura.io/v3/5ec87777b5284787be325f17b6ef39fc';

const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

const fundedAccountPrivateKey = 'eae5acf2ffb38b75dc20a706af73a3a86dab391ba0525c40e725ee2236e7a16c';
const fundedAccount = web3.eth.accounts.privateKeyToAccount(fundedAccountPrivateKey);
web3.eth.accounts.wallet.add(fundedAccount);
const fundedAccountAddress = fundedAccount.address;

const amountToSend = web3.utils.toWei('0.00025', 'ether');

const accounts = JSON.parse(fs.readFileSync('wallets.json'));

const fundAccounts = async () => {
    for (let account of accounts) {
        const tx = {
            from: fundedAccountAddress,
            to: account.address,
            value: amountToSend,
            gas: 21000, 
            gasPrice: await web3.eth.getGasPrice()
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, fundedAccountPrivateKey);

        await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
            .on('receipt', (receipt) => {
                console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
            })
            .on('error', (error) => {
                console.error('Error sending transaction:', error);
            });
    }
};

fundAccounts().then(() => {
    console.log('All accounts have been funded.');
}).catch(err => {
    console.error('Error funding accounts:', err);
});
