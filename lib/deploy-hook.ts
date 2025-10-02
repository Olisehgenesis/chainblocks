export interface DeployResult {
  success: boolean
  contractAddress?: string
  transactionHash?: string
  error?: string
  gasUsed?: string
  network?: string
}

export interface CompileResult {
  success: boolean
  error?: string
  artifacts?: string[]
  abi?: any
  bytecode?: string
  contractName?: string
}

export interface PreparedUnsignedTx {
  to: string | null
  data: string
  value?: string
  gas?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
}

export class DeployHook {
  async compileContract(contractCode: string, contractName: string): Promise<CompileResult> {
    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractCode,
          contractName
        })
      })

      const result = await response.json()
      return result
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Compilation failed'
      }
    }
  }

  async prepareUnsignedDeployTx(abi: any, bytecode: string, constructorArgs: any[] = [], network?: string): Promise<{ success: boolean; unsignedTx?: PreparedUnsignedTx; error?: string }> {
    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abi, bytecode, constructorArgs, network })
      })
      const json = await response.json()
      return json
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to prepare transaction' }
    }
  }

  async cleanup(): Promise<void> {
    // Cleanup is handled server-side in the API routes
    // No client-side cleanup needed
  }
}

export const deployHook = new DeployHook()

