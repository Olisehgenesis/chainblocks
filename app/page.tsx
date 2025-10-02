"use client"

import { useState, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import DeployContract from '@/components/deploy-contract'

function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 border border-red-200">
          <h2 className="text-xl font-bold text-red-700 mb-4">Compilation Error</h2>
          <pre className="bg-red-50 p-4 rounded text-sm text-red-800 whitespace-pre-wrap overflow-auto max-h-96">
            {error.message}
            {error.stack && `\n\nStack trace:\n${error.stack}`}
          </pre>
          <button
            onClick={resetErrorBoundary}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [contractName, setContractName] = useState('MyContract')
  const [contractCode, setContractCode] = useState(`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyContract {
    uint256 public value;
    constructor(uint256 initial) { value = initial; }
}`)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null)

  async function compile() {
    try {
      setLoading(true)
      setError(null)
      setResult(null)

      // First, save the contract to a temporary file
      const tempFileName = `${contractName}.sol`
      
      // Save the contract using the IDE API
      const saveResponse = await fetch('/api/ide/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: tempFileName,
          content: contractCode
        })
      })
      
      const saveData = await saveResponse.json()
      if (!saveData.success) {
        throw new Error(`Failed to save contract: ${saveData.error}`)
      }

      // Now compile using the IDE API
      const compileResponse = await fetch('/api/ide/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: tempFileName
        })
      })
      
      const compileData = await compileResponse.json()
      if (!compileData.success) {
        throw new Error(`Compilation failed: ${compileData.error}`)
      }

      const output = compileData.output
      
      // Get the compiled contract
      const contract = output.contracts[tempFileName][contractName]
      
      if (!contract) {
        setError(`Contract ${contractName} not found in compilation output`)
        return
      }

      const abi = contract.abi
      const bytecode = contract.evm?.bytecode?.object || contract.bytecode?.object

      if (!abi) {
        setError('ABI not found in compilation output')
        return
      }

      if (!bytecode) {
        setError('Bytecode not found in compilation output')
        return
      }

      setResult({
        contractName,
        abi,
        bytecode,
        success: true
      })

    } catch (e: any) {
      console.error('Compilation error:', e)
      console.error('Error stack:', e.stack)
      console.error('Error details:', {
        message: e.message,
        name: e.name,
        cause: e.cause
      })
      setError(`Compilation failed: ${e.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">ChainBlocks - Compile</h1>
            <a 
              href="/ide" 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
            >
              Open Solidity IDE
            </a>
          </div>

          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Contract Name</label>
              <input
                className="flex-1 border rounded px-3 py-2 text-sm"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Solidity</label>
              <textarea
                className="w-full h-64 border rounded p-3 font-mono text-sm"
                value={contractCode}
                onChange={(e) => setContractCode(e.target.value)}
              />
            </div>

            <div>
              <button
                onClick={compile}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded"
              >
                {loading ? 'Compiling...' : 'Compile'}
              </button>
            </div>

            {error && (
              <div className="text-red-600 text-sm whitespace-pre-wrap">{error}</div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-700 font-semibold">ABI</div>
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
{JSON.stringify(result.abi, null, 2)}
                  </pre>
                  <div className="text-sm text-gray-700 font-semibold">Bytecode</div>
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto break-all">
{result.bytecode}
                  </pre>
                </div>
                
                {/* Deployment Section */}
                <div className="border-t pt-4">
                  <DeployContract 
                    contractName={contractName}
                    onDeployed={(address) => setDeployedAddress(address)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
