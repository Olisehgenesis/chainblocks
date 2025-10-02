#!/usr/bin/env node

/**
 * ChainBlocks Server Example
 * 
 * This script demonstrates how to use the ChainBlocks server endpoints
 * for compiling and deploying smart contracts.
 * 
 * Usage:
 *   node examples/server-example.js
 * 
 * Make sure to have a local blockchain running (Hardhat node) before running this script.
 */

import { ethers } from 'ethers'

// Example contract code
const EXAMPLE_CONTRACT = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private storedData;
    
    event DataStored(uint256 data);
    
    constructor(uint256 initialValue) {
        storedData = initialValue;
    }
    
    function set(uint256 x) public {
        storedData = x;
        emit DataStored(x);
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
}
`

const CONTRACT_NAME = 'SimpleStorage'
const CONSTRUCTOR_ARGS = [42] // Initial value

// Configuration
const API_BASE_URL = 'http://localhost:3000/api'
const NETWORK = 'localhost' // Change to 'baseSepolia' for testnet

// You can generate a new wallet or use an existing private key
// For testing, we'll generate a new wallet
const TEST_WALLET = ethers.Wallet.createRandom()

async function main() {
  console.log('🚀 ChainBlocks Server Example')
  console.log('==============================')
  
  console.log(`📝 Contract: ${CONTRACT_NAME}`)
  console.log(`🌐 Network: ${NETWORK}`)
  console.log(`👛 Wallet: ${TEST_WALLET.address}`)
  console.log('')

  try {
    // Step 1: Compile the contract
    console.log('📦 Step 1: Compiling contract...')
    const compileResult = await compileContract()
    
    if (!compileResult.success) {
      console.error('❌ Compilation failed:', compileResult.error)
      return
    }
    
    console.log('✅ Contract compiled successfully!')
    console.log(`   ABI length: ${compileResult.abi.length} functions`)
    console.log(`   Bytecode length: ${compileResult.bytecode.length} characters`)
    console.log('')

    // Step 2: Prepare deployment transaction
    console.log('🔧 Step 2: Preparing deployment transaction...')
    const prepareResult = await prepareDeployment(compileResult.abi, compileResult.bytecode)
    
    if (!prepareResult.success) {
      console.error('❌ Preparation failed:', prepareResult.error)
      return
    }
    
    console.log('✅ Transaction prepared successfully!')
    console.log(`   Gas estimate: ${prepareResult.unsignedTx.gas}`)
    console.log(`   Max fee per gas: ${prepareResult.unsignedTx.maxFeePerGas}`)
    console.log('')

    // Step 3: Deploy the contract
    console.log('🚀 Step 3: Deploying contract...')
    const deployResult = await deployContract(compileResult.abi, compileResult.bytecode)
    
    if (!deployResult.success) {
      console.error('❌ Deployment failed:', deployResult.error)
      return
    }
    
    console.log('✅ Contract deployed successfully!')
    console.log(`   Contract address: ${deployResult.contractAddress}`)
    console.log(`   Transaction hash: ${deployResult.transactionHash}`)
    console.log(`   Gas used: ${deployResult.gasUsed}`)
    console.log('')

    // Step 4: Interact with the deployed contract
    console.log('🔗 Step 4: Interacting with deployed contract...')
    await interactWithContract(deployResult.contractAddress, compileResult.abi)
    
  } catch (error) {
    console.error('❌ Example failed:', error)
  }
}

async function compileContract() {
  const response = await fetch(`${API_BASE_URL}/compile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contractCode: EXAMPLE_CONTRACT,
      contractName: CONTRACT_NAME
    })
  })
  
  return await response.json()
}

async function prepareDeployment(abi: any[], bytecode: string) {
  const response = await fetch(`${API_BASE_URL}/deploy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contractName: CONTRACT_NAME,
      abi,
      bytecode,
      constructorArgs: CONSTRUCTOR_ARGS,
      network: NETWORK,
      action: 'prepare'
    })
  })
  
  return await response.json()
}

async function deployContract(abi: any[], bytecode: string) {
  const response = await fetch(`${API_BASE_URL}/deploy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contractName: CONTRACT_NAME,
      abi,
      bytecode,
      constructorArgs: CONSTRUCTOR_ARGS,
      privateKey: TEST_WALLET.privateKey,
      network: NETWORK,
      action: 'deploy'
    })
  })
  
  return await response.json()
}

async function interactWithContract(contractAddress: string, abi: any[]) {
  try {
    // Create provider and contract instance
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545')
    const wallet = TEST_WALLET.connect(provider)
    const contract = new ethers.Contract(contractAddress, abi, wallet)
    
    // Read initial value
    const initialValue = await contract.get()
    console.log(`   Initial value: ${initialValue}`)
    
    // Set new value
    const newValue = 100
    console.log(`   Setting new value to: ${newValue}`)
    const tx = await contract.set(newValue)
    await tx.wait()
    
    // Read updated value
    const updatedValue = await contract.get()
    console.log(`   Updated value: ${updatedValue}`)
    
    console.log('✅ Contract interaction completed!')
    
  } catch (error) {
    console.error('❌ Contract interaction failed:', error)
  }
}

// Helper function to check if server is running
async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractCode: '', contractName: 'test' })
    })
    return response.status !== 404
  } catch {
    return false
  }
}

// Run the example
if (import.meta.url === `file://${process.argv[1]}`) {
  checkServerHealth().then(isRunning => {
    if (!isRunning) {
      console.error('❌ Server is not running. Please start the Next.js development server first:')
      console.error('   npm run dev')
      process.exit(1)
    }
    main().catch(console.error)
  })
}
