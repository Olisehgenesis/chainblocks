'use client';

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Rocket, 
  CheckCircle, 
  XCircle, 
  Loader2,
  ExternalLink,
  Copy
} from 'lucide-react';

interface DeploymentData {
  abi: any[];
  bytecode: string;
  constructorArgs: any[];
  network: string;
  contractName: string;
}

interface DeployContractProps {
  contractName: string;
  onDeployed?: (contractAddress: string) => void;
}

export default function DeployContract({ contractName, onDeployed }: DeployContractProps) {
  const [constructorArgs, setConstructorArgs] = useState<string>('');
  const [isPreparing, setIsPreparing] = useState(false);
  const [deploymentData, setDeploymentData] = useState<DeploymentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  
  const { 
    writeContract, 
    data: hash, 
    error: writeError, 
    isPending: isWriting 
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    data: receipt 
  } = useWaitForTransactionReceipt({
    hash,
  });

  const parseConstructorArgs = (argsString: string): any[] => {
    if (!argsString.trim()) return [];
    
    try {
      // Try to parse as JSON array
      return JSON.parse(argsString);
    } catch {
      // If not JSON, split by comma and parse individual values
      return argsString.split(',').map(arg => {
        const trimmed = arg.trim();
        // Try to parse as number
        if (!isNaN(Number(trimmed))) return Number(trimmed);
        // Try to parse as boolean
        if (trimmed.toLowerCase() === 'true') return true;
        if (trimmed.toLowerCase() === 'false') return false;
        // Return as string (remove quotes if present)
        return trimmed.replace(/^["']|["']$/g, '');
      });
    }
  };

  const prepareDeployment = async () => {
    if (!contractName) return;
    
    setIsPreparing(true);
    setError(null);
    
    try {
      const args = parseConstructorArgs(constructorArgs);
      
      const response = await fetch('/api/ide/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: contractName,
          constructorArgs: args
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDeploymentData(data.deploymentData);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPreparing(false);
    }
  };

  const deployContract = async () => {
    if (!deploymentData || !isConnected) return;
    
    try {
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as `0x${string}`, // This will be replaced by the actual contract creation
        abi: deploymentData.abi,
        functionName: 'constructor',
        args: deploymentData.constructorArgs,
        bytecode: deploymentData.bytecode as `0x${string}`,
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getExplorerUrl = (address: string) => {
    // Base Sepolia explorer
    return `https://sepolia.basescan.org/address/${address}`;
  };

  // Update deployed address when transaction is confirmed
  React.useEffect(() => {
    if (isConfirmed && receipt?.contractAddress) {
      setDeployedAddress(receipt.contractAddress);
      onDeployed?.(receipt.contractAddress);
    }
  }, [isConfirmed, receipt, onDeployed]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Rocket className="h-5 w-5" />
          <span>Deploy Contract</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">Connect your wallet to deploy contracts</p>
            <Button disabled>
              <Rocket className="h-4 w-4 mr-2" />
              Deploy Contract
            </Button>
          </div>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Constructor Arguments (JSON array or comma-separated values)
              </label>
              <Input
                placeholder='["Hello", 123, true] or Hello, 123, true'
                value={constructorArgs}
                onChange={(e) => setConstructorArgs(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty if no constructor arguments needed
              </p>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={prepareDeployment} 
                disabled={isPreparing || !contractName}
                className="flex-1"
              >
                {isPreparing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4 mr-2" />
                    Prepare Deployment
                  </>
                )}
              </Button>
            </div>

            {deploymentData && (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Ready to Deploy
                    </span>
                  </div>
                  <p className="text-xs text-green-700">
                    Contract: {deploymentData.contractName}
                  </p>
                  <p className="text-xs text-green-700">
                    Network: {deploymentData.network}
                  </p>
                </div>

                <Button 
                  onClick={deployContract}
                  disabled={isWriting || isConfirming}
                  className="w-full"
                >
                  {isWriting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deploying...
                    </>
                  ) : isConfirming ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4 mr-2" />
                      Deploy Contract
                    </>
                  )}
                </Button>

                {writeError && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        Deployment Failed
                      </span>
                    </div>
                    <p className="text-xs text-red-700 mt-1">
                      {writeError.message}
                    </p>
                  </div>
                )}

                {isConfirmed && deployedAddress && (
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Contract Deployed!
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-green-100 px-2 py-1 rounded">
                        {deployedAddress}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(deployedAddress)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(getExplorerUrl(deployedAddress), '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">
                    Error
                  </span>
                </div>
                <p className="text-xs text-red-700 mt-1">
                  {error}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
