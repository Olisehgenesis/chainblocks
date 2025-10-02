import { ethers } from 'ethers'
import { createWalletClient, createPublicClient, http, parseEther, formatEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet, sepolia, base, baseSepolia } from 'viem/chains'

export interface WalletInfo {
  address: string
  balance: string
  nonce: number
  chainId: number
}

export interface NetworkConfig {
  name: string
  chainId: number
  rpcUrl: string
  explorerUrl?: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export class WalletManager {
  private static networks: { [key: string]: NetworkConfig } = {
    localhost: {
      name: 'Localhost',
      chainId: 31337,
      rpcUrl: 'http://127.0.0.1:8545',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      }
    },
    hardhat: {
      name: 'Hardhat',
      chainId: 31337,
      rpcUrl: 'http://127.0.0.1:8545',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      }
    },
    mainnet: {
      name: 'Ethereum Mainnet',
      chainId: 1,
      rpcUrl: 'https://eth.llamarpc.com',
      explorerUrl: 'https://etherscan.io',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      }
    },
    sepolia: {
      name: 'Sepolia',
      chainId: 11155111,
      rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
      explorerUrl: 'https://sepolia.etherscan.io',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      }
    },
    baseSepolia: {
      name: 'Base Sepolia',
      chainId: 84532,
      rpcUrl: 'https://sepolia.base.org',
      explorerUrl: 'https://sepolia.basescan.org',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      }
    },
    celoAlfajores: {
      name: 'Celo Alfajores',
      chainId: 44787,
      rpcUrl: 'https://alfajores-forno.celo-testnet.org',
      explorerUrl: 'https://alfajores.celoscan.io',
      nativeCurrency: {
        name: 'Celo',
        symbol: 'CELO',
        decimals: 18
      }
    }
  }

  static getNetworkConfig(network: string): NetworkConfig {
    return this.networks[network] || this.networks.localhost
  }

  static getAllNetworks(): NetworkConfig[] {
    return Object.values(this.networks)
  }

  static createWallet(privateKey?: string): ethers.Wallet {
    if (privateKey) {
      return new ethers.Wallet(privateKey)
    }
    return ethers.Wallet.createRandom()
  }

  static async getWalletInfo(privateKey: string, network: string = 'localhost'): Promise<WalletInfo> {
    try {
      const networkConfig = this.getNetworkConfig(network)
      const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl)
      const wallet = new ethers.Wallet(privateKey, provider)
      
      const [balance, nonce, chainId] = await Promise.all([
        provider.getBalance(wallet.address),
        provider.getTransactionCount(wallet.address),
        provider.getNetwork().then(n => n.chainId)
      ])

      return {
        address: wallet.address,
        balance: ethers.formatEther(balance),
        nonce,
        chainId: Number(chainId)
      }
    } catch (error: any) {
      throw new Error(`Failed to get wallet info: ${error.message}`)
    }
  }

  static async sendTransaction(
    privateKey: string,
    to: string,
    value: string,
    data?: string,
    network: string = 'localhost'
  ): Promise<{ hash: string; address: string }> {
    try {
      const networkConfig = this.getNetworkConfig(network)
      const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl)
      const wallet = new ethers.Wallet(privateKey, provider)
      
      const tx = {
        to,
        value: ethers.parseEther(value),
        data: data || '0x'
      }
      
      const transaction = await wallet.sendTransaction(tx)
      
      return {
        hash: transaction.hash,
        address: wallet.address
      }
    } catch (error: any) {
      throw new Error(`Transaction failed: ${error.message}`)
    }
  }

  static async estimateGas(
    privateKey: string,
    to: string,
    value: string,
    data?: string,
    network: string = 'localhost'
  ): Promise<string> {
    try {
      const networkConfig = this.getNetworkConfig(network)
      const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl)
      const wallet = new ethers.Wallet(privateKey, provider)
      
      const tx = {
        to,
        value: ethers.parseEther(value),
        data: data || '0x'
      }
      
      const gasEstimate = await provider.estimateGas(tx)
      return gasEstimate.toString()
    } catch (error: any) {
      throw new Error(`Gas estimation failed: ${error.message}`)
    }
  }

  static async getGasPrice(network: string = 'localhost'): Promise<{
    gasPrice?: string
    maxFeePerGas?: string
    maxPriorityFeePerGas?: string
  }> {
    try {
      const networkConfig = this.getNetworkConfig(network)
      const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl)
      const feeData = await provider.getFeeData()
      
      return {
        gasPrice: feeData.gasPrice?.toString(),
        maxFeePerGas: feeData.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString()
      }
    } catch (error: any) {
      throw new Error(`Failed to get gas price: ${error.message}`)
    }
  }

  static validatePrivateKey(privateKey: string): boolean {
    try {
      // Remove 0x prefix if present
      const cleanKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey
      
      // Check if it's a valid hex string and has correct length
      if (!/^[0-9a-fA-F]{64}$/.test(cleanKey)) {
        return false
      }
      
      // Try to create a wallet to validate
      new ethers.Wallet('0x' + cleanKey)
      return true
    } catch {
      return false
    }
  }

  static generateRandomWallet(): { address: string; privateKey: string; mnemonic: string } {
    const wallet = ethers.Wallet.createRandom()
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase || ''
    }
  }

  static async checkNetworkConnection(network: string): Promise<boolean> {
    try {
      const networkConfig = this.getNetworkConfig(network)
      const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl)
      await provider.getBlockNumber()
      return true
    } catch {
      return false
    }
  }
}

// Viem-based utilities for more advanced operations
export class ViemWalletManager {
  static getChain(network: string) {
    const chainMap: { [key: string]: any } = {
      mainnet,
      sepolia,
      base,
      baseSepolia
    }
    return chainMap[network] || mainnet
  }

  static createWalletClient(privateKey: string, network: string = 'localhost') {
    const account = privateKeyToAccount(privateKey as `0x${string}`)
    const chain = this.getChain(network)
    
    return createWalletClient({
      account,
      chain,
      transport: http()
    })
  }

  static createPublicClient(network: string = 'localhost') {
    const chain = this.getChain(network)
    
    return createPublicClient({
      chain,
      transport: http()
    })
  }
}
