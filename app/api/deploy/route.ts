import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

export async function POST(request: NextRequest) {
  try {
    const { 
      contractName, 
      abi, 
      bytecode, 
      constructorArgs = [], 
      privateKey, 
      network = 'localhost',
      action = 'prepare' // 'prepare' or 'deploy'
    } = await request.json()

    if (!contractName || !abi || !bytecode) {
      return NextResponse.json(
        { success: false, error: 'Missing contractName, abi or bytecode' },
        { status: 400 }
      )
    }

    // Get provider based on network
    const provider = getProvider(network)
    
    if (action === 'prepare') {
      // Prepare unsigned transaction for client-side signing
      return await prepareDeployTransaction(contractName, abi, bytecode, constructorArgs, provider)
    } else if (action === 'deploy') {
      // Deploy directly with private key (server-side)
      if (!privateKey) {
        return NextResponse.json(
          { success: false, error: 'Private key required for direct deployment' },
          { status: 400 }
        )
      }
      return await deployContract(contractName, abi, bytecode, constructorArgs, privateKey, provider, network)
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Use "prepare" or "deploy"' },
        { status: 400 }
      )
    }

  } catch (error: any) {
    console.error('Deploy error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Deployment failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'deploy',
    methods: ['POST'],
  })
}

async function prepareDeployTransaction(
  contractName: string,
  abi: any[],
  bytecode: string,
  constructorArgs: any[],
  provider: ethers.Provider
): Promise<NextResponse> {
  try {
    // Create a temporary wallet for estimation (no private key needed)
    const tempWallet = ethers.Wallet.createRandom().connect(provider)
    
    // Create contract factory
    const factory = new ethers.ContractFactory(abi, bytecode, tempWallet)
    
    // Get deployment transaction
    const tx = await factory.getDeployTransaction(...constructorArgs)
    
    // Estimate gas
    const estimatedGas = await provider.estimateGas(tx)
    
    // Get fee data
    const feeData = await provider.getFeeData()
    
    // Get current nonce (we'll use 0 for now, client should update)
    const nonce = await tempWallet.getNonce()
    
    // Prepare unsigned transaction
    const unsignedTx = {
      to: tx.to || null,
      data: tx.data,
      value: tx.value ? tx.value.toString() : '0',
      gas: estimatedGas.toString(),
      maxFeePerGas: feeData.maxFeePerGas?.toString(),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
      nonce: nonce,
      chainId: (await provider.getNetwork()).chainId
    }

    return NextResponse.json({
      success: true,
      unsignedTx,
      contractName,
      message: 'Transaction prepared. Sign and send this transaction to deploy the contract.'
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to prepare transaction'
    }, { status: 500 })
  }
}

async function deployContract(
  contractName: string,
  abi: any[],
  bytecode: string,
  constructorArgs: any[],
  privateKey: string,
  provider: ethers.Provider,
  network: string
): Promise<NextResponse> {
  try {
    // Create wallet from private key
    const wallet = new ethers.Wallet(privateKey, provider)
    
    console.log(`Deploying ${contractName} from wallet: ${wallet.address}`)
    
    // Create contract factory
    const factory = new ethers.ContractFactory(abi, bytecode, wallet)
    
    // Deploy contract
    const contract = await factory.deploy(...constructorArgs)
    
    console.log(`Contract deployment transaction sent: ${contract.deploymentTransaction()?.hash}`)
    
    // Wait for deployment
    await contract.waitForDeployment()
    
    const contractAddress = await contract.getAddress()
    const deploymentTx = contract.deploymentTransaction()
    
    console.log(`Contract deployed successfully at: ${contractAddress}`)
    
    return NextResponse.json({
      success: true,
      contractAddress,
      transactionHash: deploymentTx?.hash,
      gasUsed: deploymentTx?.gasLimit?.toString(),
      network,
      contractName,
      deployerAddress: wallet.address
    })

  } catch (error: any) {
    console.error('Deployment error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Deployment failed',
      network
    }, { status: 500 })
  }
}

function getProvider(network: string): ethers.Provider {
  const networkConfigs: { [key: string]: string } = {
    localhost: 'http://127.0.0.1:8545',
    baseSepolia: 'https://sepolia.base.org',
    celoAlfajores: 'https://alfajores-forno.celo-testnet.org',
    hardhat: 'http://127.0.0.1:8545',
    mainnet: 'https://eth.llamarpc.com',
    sepolia: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
  }

  const rpcUrl = networkConfigs[network] || networkConfigs.localhost
  return new ethers.JsonRpcProvider(rpcUrl)
}

// Legacy function for backward compatibility
function parseDeployOutput(output: string): { address?: string; txHash?: string; gasUsed?: string } {
  try {
    const lines = output.split('\n')
    const resultLine = lines.find(line => line.includes('DEPLOY_RESULT:'))
    
    if (resultLine) {
      const jsonStr = resultLine.split('DEPLOY_RESULT:')[1]
      return JSON.parse(jsonStr)
    }
    
    // Fallback parsing
    const address = lines.find(line => line.includes('Contract deployed to:'))?.split(':')[1]?.trim()
    const txHash = lines.find(line => line.includes('Transaction hash:'))?.split(':')[1]?.trim()
    const gasUsed = lines.find(line => line.includes('Gas used:'))?.split(':')[1]?.trim()
    
    return { address, txHash, gasUsed }
  } catch {
    return {}
  }
}
