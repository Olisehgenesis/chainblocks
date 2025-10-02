#!/usr/bin/env node

// Test script to verify SOLC compilation works in Node.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Testing SOLC compilation in Node.js...');

// Test the same contract that's failing in the worker
const contractSource = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MyContract {
    uint256 public value;
    constructor(uint256 initial) { value = initial; }
}`;

// Prepare the input exactly like in the AI overview
const input = {
    language: 'Solidity',
    sources: {
        'MyContract.sol': {
            content: contractSource,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode.object'],
            },
        },
    },
};

try {
    // Import solc dynamically since we're using ES modules
    const solc = await import('solc');
    console.log('SOLC imported successfully');
    console.log('SOLC version:', solc.default.version());
    
    // Compile the contract exactly like in the AI overview
    console.log('Compiling contract...');
    const output = JSON.parse(solc.default.compile(JSON.stringify(input)));
    
    console.log('Compilation completed!');
    console.log('Output keys:', Object.keys(output));
    
    // Check for errors
    if (output.errors && output.errors.length > 0) {
        console.log('Compilation errors:');
        output.errors.forEach(error => {
            console.log('-', error.formattedMessage || error.message);
        });
    } else {
        console.log('✅ No compilation errors!');
        
        // Extract ABI and Bytecode like in the AI overview
        if (output.contracts && output.contracts['MyContract.sol'] && output.contracts['MyContract.sol']['MyContract']) {
            const contract = output.contracts['MyContract.sol']['MyContract'];
            const abi = contract.abi;
            const bytecode = contract.evm.bytecode.object;
            
            console.log('✅ ABI extracted successfully');
            console.log('✅ Bytecode extracted successfully');
            console.log('ABI length:', abi.length);
            console.log('Bytecode length:', bytecode.length);
        } else {
            console.log('❌ Could not extract contract data');
            console.log('Available contracts:', Object.keys(output.contracts || {}));
        }
    }
    
} catch (error) {
    console.error('❌ Compilation failed:', error.message);
    console.error('Error stack:', error.stack);
}
