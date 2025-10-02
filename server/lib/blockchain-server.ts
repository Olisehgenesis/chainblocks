import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { ethers } from 'ethers';

const execAsync = promisify(exec);

export interface CompileResult {
  success: boolean;
  contractName?: string;
  abi?: any[];
  bytecode?: string;
  error?: string;
  stdout?: string;
}

export interface DeployResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  error?: string;
  gasUsed?: string;
  network?: string;
}

export class BlockchainServer {
  private contractsDir: string;
  private artifactsDir: string;
  private scriptsDir: string;

  constructor() {
    this.contractsDir = path.join(process.cwd(), 'contracts');
    this.artifactsDir = path.join(process.cwd(), 'artifacts');
    this.scriptsDir = path.join(process.cwd(), 'scripts');
    
    // Ensure directories exist
    this.ensureDirectories();
  }

  private ensureDirectories(): void {
    [this.contractsDir, this.scriptsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async compileContract(contractCode: string, contractName: string): Promise<CompileResult> {
    try {
      // Write contract to file
      const contractPath = path.join(this.contractsDir, `${contractName}.sol`);
      fs.writeFileSync(contractPath, contractCode);

      // Compile using Hardhat
      const { stdout, stderr } = await execAsync('npx hardhat compile', {
        cwd: process.cwd(),
        timeout: 30000
      });

      if (stderr && stderr.includes('error')) {
        return {
          success: false,
          error: stderr
        };
      }

      // Get compiled artifact content
      const artifactPath = path.join(this.artifactsDir, 'contracts', `${contractName}.sol`, `${contractName}.json`);
      if (!fs.existsSync(artifactPath)) {
        return {
          success: false,
          error: 'Artifact not found after compilation',
        };
      }

      const artifactRaw = fs.readFileSync(artifactPath, 'utf-8');
      const artifact = JSON.parse(artifactRaw);

      const abi = artifact.abi;
      const bytecode: string | undefined = artifact.bytecode || artifact.deployedBytecode || artifact.evm?.bytecode?.object;

      if (!abi || !bytecode) {
        return {
          success: false,
          error: 'ABI or bytecode missing in artifact',
        };
      }

      return {
        success: true,
        contractName,
        abi,
        bytecode,
        stdout
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Compilation failed'
      };
    }
  }

  async deployContract(
    contractName: string,
    abi: any[],
    bytecode: string,
    constructorArgs: any[] = [],
    privateKey: string,
    network: string = 'localhost'
  ): Promise<DeployResult> {
    try {
      // Create provider based on network
      const provider = this.getProvider(network);
      
      // Create wallet from private key
      const wallet = new ethers.Wallet(privateKey, provider);
      
      // Create contract factory
      const factory = new ethers.ContractFactory(abi, bytecode, wallet);
      
      // Deploy contract
      const contract = await factory.deploy(...constructorArgs);
      
      // Wait for deployment
      await contract.waitForDeployment();
      
      const contractAddress = await contract.getAddress();
      const deploymentTx = contract.deploymentTransaction();
      
      return {
        success: true,
        contractAddress,
        transactionHash: deploymentTx?.hash,
        gasUsed: deploymentTx?.gasLimit?.toString(),
        network
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Deployment failed',
        network
      };
    }
  }

  async prepareDeployTransaction(
    contractName: string,
    abi: any[],
    bytecode: string,
    constructorArgs: any[] = [],
    network: string = 'localhost'
  ): Promise<{ success: boolean; unsignedTx?: any; error?: string }> {
    try {
      const provider = this.getProvider(network);
      
      // Create a temporary wallet for estimation (no private key needed)
      const tempWallet = ethers.Wallet.createRandom().connect(provider);
      
      // Create contract factory
      const factory = new ethers.ContractFactory(abi, bytecode, tempWallet);
      
      // Get deployment transaction
      const tx = await factory.getDeployTransaction(...constructorArgs);
      
      // Estimate gas
      const estimatedGas = await provider.estimateGas(tx);
      
      // Get fee data
      const feeData = await provider.getFeeData();
      
      // Prepare unsigned transaction
      const unsignedTx = {
        to: tx.to || null,
        data: tx.data,
        value: tx.value ? tx.value.toString() : '0',
        gas: estimatedGas.toString(),
        maxFeePerGas: feeData.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
        nonce: await tempWallet.getNonce()
      };

      return {
        success: true,
        unsignedTx
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to prepare transaction'
      };
    }
  }

  private getProvider(network: string): ethers.Provider {
    const networkConfigs: { [key: string]: string } = {
      localhost: 'http://127.0.0.1:8545',
      baseSepolia: 'https://sepolia.base.org',
      celoAlfajores: 'https://alfajores-forno.celo-testnet.org',
      hardhat: 'http://127.0.0.1:8545'
    };

    const rpcUrl = networkConfigs[network] || networkConfigs.localhost;
    return new ethers.JsonRpcProvider(rpcUrl);
  }

  async cleanup(): Promise<void> {
    // Clean up temporary files
    try {
      const files = fs.readdirSync(this.contractsDir);
      for (const file of files) {
        if (file.endsWith('.sol')) {
          fs.unlinkSync(path.join(this.contractsDir, file));
        }
      }
    } catch (error) {
      console.warn('Cleanup failed:', error);
    }
  }
}

export const blockchainServer = new BlockchainServer();
