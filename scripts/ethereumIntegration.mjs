import fs from 'fs';
import path from 'path';
import Web3 from 'web3';

// Connect to your local Ethereum node
// Highlight bug in this line(web3 cannot be used as a constructor, i'll look for a solution)
const web3 = new Web3('http://localhost:8551');

// Load the compiled smart contract ABI and bytecode
const filePath = '/home/carbanak/Desktop/DEVSECURE/scripts/IdentityContract.json';
const contractData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
const abi = contractData.abi;
const bytecode = contractData.bytecode;

// Set the Ethereum account private key with some test ether
const privateKey = 'YOUR_PRIVATE_KEY'; // I'll replace with my key lol
web3.eth.accounts.wallet.add(privateKey);

// Deployment of the smart contract
async function deployContract() {
    const accounts = await web3.eth.getAccounts();
    const gasEstimate = await web3.eth.estimateGas({ data: bytecode });

    const contract = new web3.eth.Contract(abi);

    const deployedContract = await contract.deploy({
        data: bytecode,
    }).send({
        from: accounts[0],
        gas: gasEstimate,
    });

    console.log('Contract deployed to:', deployedContract.options.address);
}

// Set identity using the deployed contract
async function setIdentity() {
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(abi, 'CONTRACT_ADDRESS'); // I'll replace with the deployed contract address

    await contract.methods.setIdentity('YourIdentity').send({ from: accounts[0] });
    console.log('Identity set successfully.');
}

// Get identity using the deployed contract
async function getIdentity() {
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(abi, 'CONTRACT_ADDRESS'); // Replace with the deployed contract address

    const identity = await contract.methods.getIdentity().call({ from: accounts[0] });
    console.log('Identity retrieved:', identity);
}

deployContract();
setIdentity();
getIdentity();
