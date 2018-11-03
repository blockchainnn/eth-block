const assert = require('assert');
const ganache = require('ganache-cli');

// Require Web3 constructor
const Web3 = require('web3');


// Set the provider
const provider = ganache.provider();

// Create new instance of Web3
const web3 = new Web3(provider);

// Taken from the module.exports obj returned in compile.js
const { interface, bytecode } = require('../compile');

// console.log(web3.eth.getAccounts().then(fetchedAccounts => {console.log(fetchedAccounts)}));

let INITIAL_MESSAGE = 'Hello, World!';
let NEW_MESSAGE = 'Hello, Andrea';

let accounts;
let inbox;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of the accounts to deploy contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [INITIAL_MESSAGE] })
        .send({ from: accounts[0], gas: '1000000' });

    inbox.setProvider(provider);
});


describe('Inbox', () => {

    it('should deploy a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('should have a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.strictEqual(message, INITIAL_MESSAGE);
    });

    it('should change the message', async () => {

        // Call set message, passing in new message, and define who is paying within send()
        await inbox.methods.setMessage(NEW_MESSAGE).send({ from: accounts[0] });

        // Retrieve the updated message, which should new be set to NEW_MESSAGE
        const message = await inbox.methods.message().call();

        assert.strictEqual(message, NEW_MESSAGE);

    })
});