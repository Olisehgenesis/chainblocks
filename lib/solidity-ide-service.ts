// Solidity IDE Core Service
// Handles compilation, file management, and contract deployment

import { promises as fs } from 'fs';
import path from 'path';
import solc from 'solc';

export class SolidityIDEService {
  private projectPath: string;
  private buildPath: string;
  private contracts: Map<string, any> = new Map();

  constructor(projectPath: string) {
    this.projectPath = projectPath;
    this.buildPath = path.join(projectPath, 'build');
  }

  // Initialize the IDE service
  async initialize(): Promise<void> {
    try {
      // Ensure build directory exists
      await fs.mkdir(this.buildPath, { recursive: true });
      console.log('Solidity IDE initialized at:', this.projectPath);
    } catch (error) {
      console.error('Failed to initialize Solidity IDE:', error);
      throw error;
    }
  }

  // File Management Methods
  async listFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.projectPath, { recursive: true });
      return files.filter(file => file.toString().endsWith('.sol'));
    } catch (error) {
      console.error('Failed to list files:', error);
      return [];
    }
  }

  async readFile(filePath: string): Promise<string> {
    try {
      const fullPath = path.join(this.projectPath, filePath);
      return await fs.readFile(fullPath, 'utf-8');
    } catch (error) {
      console.error(`Failed to read file ${filePath}:`, error);
      throw error;
    }
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      const fullPath = path.join(this.projectPath, filePath);
      const dir = path.dirname(fullPath);
      
      // Create directory if it doesn't exist
      await fs.mkdir(dir, { recursive: true });
      
      await fs.writeFile(fullPath, content, 'utf-8');
      console.log(`File written: ${filePath}`);
    } catch (error) {
      console.error(`Failed to write file ${filePath}:`, error);
      throw error;
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const fullPath = path.join(this.projectPath, filePath);
      await fs.unlink(fullPath);
      console.log(`File deleted: ${filePath}`);
    } catch (error) {
      console.error(`Failed to delete file ${filePath}:`, error);
      throw error;
    }
  }

  // Compilation Methods
  async compileContract(filePath: string): Promise<any> {
    try {
      const sourceCode = await this.readFile(filePath);
      
      const input = {
        language: 'Solidity',
        sources: {
          [filePath]: {
            content: sourceCode
          }
        },
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          outputSelection: {
            '*': {
              '*': [
                'abi',
                'evm.bytecode.object',
                'evm.deployedBytecode.object',
                'evm.gasEstimates'
              ]
            }
          }
        }
      };

      const output = JSON.parse(solc.compile(JSON.stringify(input)));

      // Check for errors
      if (output.errors) {
        const errors = output.errors.filter((e: any) => e.severity === 'error');
        if (errors.length > 0) {
          throw new Error(`Compilation errors:\n${errors.map((e: any) => e.formattedMessage).join('\n')}`);
        }
      }

      // Save build artifacts
      await this.saveBuildArtifacts(filePath, output);

      return output;
    } catch (error) {
      console.error(`Failed to compile ${filePath}:`, error);
      throw error;
    }
  }

  async compileAll(): Promise<Map<string, any>> {
    try {
      const files = await this.listFiles();
      const results = new Map();

      for (const file of files) {
        try {
          const output = await this.compileContract(file);
          results.set(file, output);
        } catch (error) {
          console.error(`Failed to compile ${file}:`, error);
          results.set(file, { error: error.message });
        }
      }

      return results;
    } catch (error) {
      console.error('Failed to compile all contracts:', error);
      throw error;
    }
  }

  // Build Artifacts Management
  private async saveBuildArtifacts(filePath: string, output: any): Promise<void> {
    try {
      const fileName = path.basename(filePath, '.sol');
      const buildFile = path.join(this.buildPath, `${fileName}.json`);
      
      await fs.writeFile(buildFile, JSON.stringify(output, null, 2));
      console.log(`Build artifacts saved: ${buildFile}`);
    } catch (error) {
      console.error('Failed to save build artifacts:', error);
      throw error;
    }
  }

  async getBuildArtifacts(fileName: string): Promise<any> {
    try {
      const buildFile = path.join(this.buildPath, `${fileName}.json`);
      const content = await fs.readFile(buildFile, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Failed to read build artifacts for ${fileName}:`, error);
      throw error;
    }
  }

  // Contract Deployment (placeholder - would integrate with your existing deployment system)
  async deployContract(fileName: string, constructorArgs: any[] = []): Promise<string> {
    try {
      const artifacts = await this.getBuildArtifacts(fileName);
      const contract = artifacts.contracts[fileName][fileName];
      
      // This would integrate with your existing deployment system
      // For now, return a placeholder
      console.log(`Deploying contract ${fileName} with args:`, constructorArgs);
      console.log('ABI:', contract.abi);
      console.log('Bytecode:', contract.evm.bytecode.object);
      
      return '0x...'; // Placeholder contract address
    } catch (error) {
      console.error(`Failed to deploy contract ${fileName}:`, error);
      throw error;
    }
  }

  // Contract Interaction (placeholder)
  async callContractMethod(
    contractAddress: string,
    methodName: string,
    args: any[] = [],
    value: string = '0'
  ): Promise<any> {
    try {
      // This would integrate with your existing contract interaction system
      console.log(`Calling ${methodName} on ${contractAddress} with args:`, args);
      console.log('Value:', value);
      
      return { result: 'placeholder' };
    } catch (error) {
      console.error('Failed to call contract method:', error);
      throw error;
    }
  }
}
