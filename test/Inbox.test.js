const assert = require('assert');
const ganache = require('ganache-cli');

// Require Web3 constructor
const Web3 = require('web3');

// Create new instance of Web3
// Note: Web3 provider argument will change depending on provider
const web3 = new Web3(ganache.provider());

