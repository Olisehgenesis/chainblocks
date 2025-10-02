'use client'

import { useEffect, useRef, useState } from 'react'
import Layout from '@/components/Layout'
import * as Blockly from 'blockly'
import { javascriptGenerator } from 'blockly/javascript'
import { Button } from '@/components/ui/button'
import { registerSolidityBlocks } from '@/lib/solidity-blocks'
import { solidityGenerator } from '@/lib/solidity-generator'
import { SyntaxHighlighter } from '@/components/SyntaxHighlighter'
import { Settings, ChevronDown, Save, FolderOpen, Play, FileText, Download, Upload, Zap, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { deployHook, DeployResult, CompileResult } from '@/lib/deploy-hook'
import { useAccount, useWalletClient } from 'wagmi'
import { parseEther } from 'viem'

// Language chooser component
function LanguageChooser({ selectedLanguage, onLanguageChange }: { 
  selectedLanguage: string, 
  onLanguageChange: (lang: string) => void 
}) {
  const languages = [
    { id: 'solidity', name: 'Solidity', available: true },
    { id: 'cairo', name: 'Cairo', available: false },
    { id: 'rust', name: 'Rust', available: false }
  ]

  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
      <span className="text-sm font-medium text-muted-foreground">Language:</span>
      {languages.map((lang) => (
        <Button
          key={lang.id}
          variant={selectedLanguage === lang.id ? "default" : "outline"}
          size="sm"
          disabled={!lang.available}
          onClick={() => onLanguageChange(lang.id)}
          className="relative"
        >
          {lang.name}
          {!lang.available && (
            <span className="absolute -top-1 -right-1 text-xs bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      ))}
    </div>
  )
}

export default function App() {
  const blocklyDiv = useRef<HTMLDivElement>(null)
  const codeDiv = useRef<HTMLPreElement>(null)
  const outputDiv = useRef<HTMLDivElement>(null)
  const workspaceRef = useRef<Blockly.Workspace | null>(null)
  const { address, isConnected } = useAccount()
  const [selectedLanguage, setSelectedLanguage] = useState('solidity')
  const [imports, setImports] = useState<{ path: string, alias?: string }[]>([])
  const [generatedCode, setGeneratedCode] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [license, setLicense] = useState('MIT')
  const [version, setVersion] = useState('^0.8.20')
  const [customLicense, setCustomLicense] = useState('')
  const [autoSave, setAutoSave] = useState(true)
  const [isCompiling, setIsCompiling] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [compileResult, setCompileResult] = useState<CompileResult | null>(null)
  const [deployResult, setDeployResult] = useState<DeployResult | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState('hardhat')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Load saved imports
  useEffect(() => {
    const saved = localStorage.getItem('solidity-imports')
    if (saved) {
      try { setImports(JSON.parse(saved)) } catch {}
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S: Save workspace
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (workspaceRef.current) {
          const state = Blockly.serialization.workspaces.save(workspaceRef.current)
          localStorage.setItem('workspace-state', JSON.stringify(state))
          console.log('Workspace saved!')
        }
      }
      
      // Ctrl/Cmd + O: Load workspace
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault()
        const saved = localStorage.getItem('workspace-state')
        if (saved && workspaceRef.current) {
          Blockly.serialization.workspaces.load(JSON.parse(saved), workspaceRef.current)
          console.log('Workspace loaded!')
        }
      }
      
      // Ctrl/Cmd + R: Run/Generate code
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault()
        runCode()
      }
      
      // Ctrl/Cmd + N: New workspace
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        if (workspaceRef.current) {
          workspaceRef.current.clear()
          console.log('New workspace created!')
        }
      }
      
      // Escape: Close settings
      if (e.key === 'Escape') {
        setShowSettings(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !workspaceRef.current) return

    const autoSaveInterval = setInterval(() => {
      if (workspaceRef.current) {
        const state = Blockly.serialization.workspaces.save(workspaceRef.current)
        localStorage.setItem('workspace-state', JSON.stringify(state))
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [autoSave])

  // Persist imports
  useEffect(() => {
    localStorage.setItem('solidity-imports', JSON.stringify(imports))
  }, [imports])

  // Function to run code
  const runCode = () => {
    if (!workspaceRef.current) return
    
    let code: string
    if (selectedLanguage === 'solidity') {
      // Pass imports to the generator
      solidityGenerator.setImports(imports)
      solidityGenerator.setLicense(license === 'Custom' ? customLicense : license)
      solidityGenerator.setVersion(version)
      code = solidityGenerator.workspaceToCode(workspaceRef.current)
    } else {
      code = javascriptGenerator.workspaceToCode(workspaceRef.current)
    }
    
    setGeneratedCode(code)
    if (outputDiv.current) {
      outputDiv.current.innerHTML = ''
    }
    
    // Only try to execute JavaScript code
    if (selectedLanguage !== 'solidity') {
      try {
        eval(code)
      } catch (error) {
        if (outputDiv.current) {
          outputDiv.current.innerHTML = `<div class="text-red-500">Error: ${error}</div>`
        }
      }
    } else {
      // For Solidity, show compilation info
      if (outputDiv.current) {
        outputDiv.current.innerHTML = `<div class="text-green-600">✓ Solidity code ready</div>`
      }
    }
  }

  // Function to compile contract
  const compileContract = async () => {
    if (!generatedCode || selectedLanguage !== 'solidity') return
    
    setIsCompiling(true)
    setCompileResult(null)
    
    try {
      // Extract contract name from generated code
      const contractMatch = generatedCode.match(/contract\s+(\w+)/)
      const contractName = contractMatch ? contractMatch[1] : 'GeneratedContract'
      
      const result = await deployHook.compileContract(generatedCode, contractName)
      setCompileResult(result)
      
      if (result.success) {
        if (outputDiv.current) {
          outputDiv.current.innerHTML = `<div class="text-green-600">✓ Contract compiled successfully!</div>`
        }
      } else {
        if (outputDiv.current) {
          outputDiv.current.innerHTML = `<div class="text-red-500">❌ Compilation failed: ${result.error}</div>`
        }
      }
    } catch (error: any) {
      setCompileResult({ success: false, error: error.message })
      if (outputDiv.current) {
        outputDiv.current.innerHTML = `<div class="text-red-500">❌ Compilation error: ${error.message}</div>`
      }
    } finally {
      setIsCompiling(false)
    }
  }

  // Function to deploy contract (prepare unsigned tx on server, sign+send in client)
  const { data: walletClient } = useWalletClient()
  const deployContract = async () => {
    if (!generatedCode || selectedLanguage !== 'solidity' || !compileResult?.success) return
    if (!isConnected || !address) {
      if (outputDiv.current) outputDiv.current.innerHTML = `<div class="text-red-500">❌ Please connect your wallet to deploy contracts</div>`
      return
    }
    if (!walletClient) {
      if (outputDiv.current) outputDiv.current.innerHTML = `<div class="text-red-500">❌ Wallet client not available</div>`
      return
    }

    setIsDeploying(true)
    setDeployResult(null)

    try {
      const contractMatch = generatedCode.match(/contract\s+(\w+)/)
      const contractName = contractMatch ? contractMatch[1] : 'GeneratedContract'

      // 1) Prepare unsigned tx on server with abi/bytecode
      const prep = await deployHook.prepareUnsignedDeployTx(
        compileResult.abi as any,
        compileResult.bytecode as string,
        [],
        selectedNetwork
      )
      if (!prep.success || !prep.unsignedTx) {
        throw new Error(prep.error || 'Failed to prepare deployment transaction')
      }

      const unsignedTx = prep.unsignedTx

      // 2) Sign & send in frontend using viem wallet client
      const hash = await walletClient.sendTransaction({
        to: unsignedTx.to ?? undefined,
        data: unsignedTx.data as `0x${string}`,
        value: unsignedTx.value ? BigInt(unsignedTx.value) : undefined,
        gas: unsignedTx.gas ? BigInt(unsignedTx.gas) : undefined,
        maxFeePerGas: unsignedTx.maxFeePerGas ? BigInt(unsignedTx.maxFeePerGas) : undefined,
        maxPriorityFeePerGas: unsignedTx.maxPriorityFeePerGas ? BigInt(unsignedTx.maxPriorityFeePerGas) : undefined,
      })

      setDeployResult({ success: true, transactionHash: hash, network: selectedNetwork })
      if (outputDiv.current) {
        outputDiv.current.innerHTML = `
          <div class="text-green-600 mb-2">✓ Deployment transaction sent!</div>
          <div class="text-sm text-gray-600">
            <div>Tx Hash: <code class="bg-gray-100 px-1 rounded">${hash}</code></div>
            <div>Deployer: <code class="bg-gray-100 px-1 rounded">${address}</code></div>
            <div>Network: ${selectedNetwork}</div>
          </div>
        `
      }
    } catch (error: any) {
      setDeployResult({ success: false, error: error.message })
      if (outputDiv.current) outputDiv.current.innerHTML = `<div class="text-red-500">❌ Deployment error: ${error.message}</div>`
    } finally {
      setIsDeploying(false)
    }
  }

  useEffect(() => {
    if (!blocklyDiv.current) return

    // Register Solidity blocks
    registerSolidityBlocks()

    // Create Solidity-focused toolbox
    const toolbox = {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: 'Variables',
          colour: '180',
          contents: [
            {
              kind: 'block',
              type: 'solidity_global_variable_declare'
            },
            {
              kind: 'block',
              type: 'solidity_global_variable_assign'
            },
            {
              kind: 'block',
              type: 'solidity_local_variable'
            },
            {
              kind: 'block',
              type: 'solidity_variable_assignment'
            },
            {
              kind: 'block',
              type: 'solidity_variable_reference'
            },
            {
              kind: 'block',
              type: 'solidity_variable_dropdown'
            },
            {
              kind: 'block',
              type: 'solidity_constant'
            },
            {
              kind: 'block',
              type: 'solidity_immutable'
            }
          ]
        },
        {
          kind: 'category',
          name: 'Data Types',
          colour: '210',
          contents: [
            {
              kind: 'block',
              type: 'solidity_uint'
            },
            {
              kind: 'block',
              type: 'solidity_address'
            },
            {
              kind: 'block',
              type: 'solidity_bool'
            },
            {
              kind: 'block',
              type: 'solidity_string'
            },
            {
              kind: 'block',
              type: 'solidity_bytes'
            },
            {
              kind: 'block',
              type: 'solidity_array'
            },
            {
              kind: 'block',
              type: 'solidity_mapping'
            }
          ]
        },
        {
          kind: 'category',
          name: 'Functions',
          colour: '120',
          contents: [
            {
              kind: 'block',
              type: 'solidity_function'
            },
            {
              kind: 'block',
              type: 'solidity_modifier'
            },
            {
              kind: 'block',
              type: 'solidity_payable'
            },
            {
              kind: 'block',
              type: 'solidity_view'
            },
            {
              kind: 'block',
              type: 'solidity_pure'
            },
            {
              kind: 'block',
              type: 'solidity_return'
            }
          ]
        },
        {
          kind: 'category',
          name: 'Contract Structure',
          colour: '230',
          contents: [
            {
              kind: 'block',
              type: 'solidity_contract'
            },
            {
              kind: 'block',
              type: 'solidity_constructor'
            },
            {
              kind: 'block',
              type: 'solidity_inheritance'
            },
            {
              kind: 'block',
              type: 'solidity_interface'
            },
            {
              kind: 'block',
              type: 'solidity_struct'
            },
            {
              kind: 'block',
              type: 'solidity_enum'
            }
          ]
        },
        {
          kind: 'category',
          name: 'Events & Logging',
          colour: '160',
          contents: [
            {
              kind: 'block',
              type: 'solidity_event'
            },
            {
              kind: 'block',
              type: 'solidity_event_advanced'
            },
            {
              kind: 'block',
              type: 'solidity_event_param'
            },
            {
              kind: 'block',
              type: 'solidity_emit'
            },
            {
              kind: 'block',
              type: 'solidity_indexed'
            }
          ]
        },
        {
          kind: 'category',
          name: 'Ether & Tokens',
          colour: '290',
          contents: [
            {
              kind: 'block',
              type: 'solidity_transfer'
            },
            {
              kind: 'block',
              type: 'solidity_send'
            },
            {
              kind: 'block',
              type: 'solidity_call'
            },
            {
              kind: 'block',
              type: 'solidity_receive'
            },
            {
              kind: 'block',
              type: 'solidity_fallback'
            },
            {
              kind: 'block',
              type: 'solidity_erc20'
            }
          ]
        },
        {
          kind: 'category',
          name: 'Error Handling',
          colour: '20',
          contents: [
            {
              kind: 'block',
              type: 'solidity_require'
            },
            {
              kind: 'block',
              type: 'solidity_revert'
            },
            {
              kind: 'block',
              type: 'solidity_assert'
            },
            {
              kind: 'block',
              type: 'solidity_try_catch'
            }
          ]
        },
        {
          kind: 'category',
          name: 'Control Flow',
          colour: '60',
          contents: [
            {
              kind: 'block',
              type: 'solidity_if'
            },
            {
              kind: 'block',
              type: 'solidity_if_else'
            },
            {
              kind: 'block',
              type: 'solidity_for_loop'
            },
            {
              kind: 'block',
              type: 'solidity_while_loop'
            },
            {
              kind: 'block',
              type: 'solidity_break'
            },
            {
              kind: 'block',
              type: 'solidity_continue'
            }
          ]
        },
        {
          kind: 'category',
          name: 'Logic & Comparison',
          colour: '300',
          contents: [
            {
              kind: 'block',
              type: 'solidity_equals'
            },
            {
              kind: 'block',
              type: 'solidity_not_equals'
            },
            {
              kind: 'block',
              type: 'solidity_less_than'
            },
            {
              kind: 'block',
              type: 'solidity_greater_than'
            },
            {
              kind: 'block',
              type: 'solidity_and'
            },
            {
              kind: 'block',
              type: 'solidity_or'
            },
            {
              kind: 'block',
              type: 'solidity_not'
            },
            {
              kind: 'block',
              type: 'solidity_true'
            },
            {
              kind: 'block',
              type: 'solidity_false'
            }
          ]
        },
        {
          kind: 'category',
          name: 'Math',
          colour: '300',
          contents: [
            {
              kind: 'block',
              type: 'solidity_add'
            },
            {
              kind: 'block',
              type: 'solidity_subtract'
            },
            {
              kind: 'block',
              type: 'solidity_multiply'
            },
            {
              kind: 'block',
              type: 'solidity_divide'
            },
            {
              kind: 'block',
              type: 'solidity_modulo'
            },
            {
              kind: 'block',
              type: 'solidity_number'
            },
            {
              kind: 'block',
              type: 'solidity_string_literal'
            }
          ]
        },
        {
          kind: 'category',
          name: 'Solidity Globals',
          colour: '300',
          contents: [
            {
              kind: 'block',
              type: 'solidity_msg_sender'
            },
            {
              kind: 'block',
              type: 'solidity_msg_value'
            },
            {
              kind: 'block',
              type: 'solidity_block_timestamp'
            },
            {
              kind: 'block',
              type: 'solidity_address_this'
            },
            {
              kind: 'block',
              type: 'solidity_this_balance'
            }
          ]
        },
        {
          kind: 'category',
          name: 'Address Operations',
          colour: '300',
          contents: [
            {
              kind: 'block',
              type: 'solidity_address_zero'
            },
            {
              kind: 'block',
              type: 'solidity_address_cast'
            },
            {
              kind: 'block',
              type: 'solidity_address_balance'
            },
            {
              kind: 'block',
              type: 'solidity_address_transfer'
            },
            {
              kind: 'block',
              type: 'solidity_address_send'
            },
            {
              kind: 'block',
              type: 'solidity_address_call'
            },
            {
              kind: 'block',
              type: 'solidity_address_equal'
            },
            {
              kind: 'block',
              type: 'solidity_address_not_equal'
            },
            {
              kind: 'block',
              type: 'solidity_address_is_zero'
            },
            {
              kind: 'block',
              type: 'solidity_address_not_zero'
            },
            {
              kind: 'block',
              type: 'solidity_owner'
            }
          ]
        },
        {
          kind: 'category',
          name: 'Math & Logic',
          colour: '300',
          contents: [
            {
              kind: 'block',
              type: 'math_number'
            },
            {
              kind: 'block',
              type: 'math_arithmetic'
            },
            {
              kind: 'block',
              type: 'logic_compare'
            },
            {
              kind: 'block',
              type: 'logic_operation'
            },
            {
              kind: 'block',
              type: 'solidity_keccak256'
            },
            {
              kind: 'block',
              type: 'solidity_abi_encode'
            }
          ]
        }
      ]
    }

    // Inject Blockly
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox,
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      }
    })

    workspaceRef.current = workspace

    // Add change listener
    workspace.addChangeListener((e: Blockly.Events.Abstract) => {
      if (e.isUiEvent || workspace.isDragging()) return
      runCode()
    })

    // Add some example blocks for Solidity
    if (selectedLanguage === 'solidity') {
      // Create a simple contract example
      const contractBlock = workspace.newBlock('solidity_contract')
      contractBlock.setFieldValue('SimpleContract', 'NAME')
      contractBlock.initSvg()
      contractBlock.render()
      
      // Position the block
      contractBlock.moveBy(50, 50)
    }

    // Initial run
    runCode()

    return () => {
      workspace.dispose()
      // Cleanup deploy files
      deployHook.cleanup()
    }
  }, [selectedLanguage])

  return (
    <Layout>
      <div className="flex h-[calc(100vh-120px)]">
        {/* Blockly Workspace */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Language Chooser */}
          <div className="p-4 border-b bg-background">
            <LanguageChooser 
              selectedLanguage={selectedLanguage} 
              onLanguageChange={setSelectedLanguage}
            />
          </div>
          
          {/* Blockly Canvas */}
          {/* Toolbar */}
          <div className="border-b bg-white px-4 py-2 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (workspaceRef.current) {
                  const state = Blockly.serialization.workspaces.save(workspaceRef.current)
                  localStorage.setItem('workspace-state', JSON.stringify(state))
                  console.log('Workspace saved!')
                }
              }}
              className="flex items-center gap-1"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const saved = localStorage.getItem('workspace-state')
                if (saved && workspaceRef.current) {
                  Blockly.serialization.workspaces.load(JSON.parse(saved), workspaceRef.current)
                  console.log('Workspace loaded!')
                }
              }}
              className="flex items-center gap-1"
            >
              <FolderOpen className="w-4 h-4" />
              Load
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (workspaceRef.current) {
                  workspaceRef.current.clear()
                  console.log('New workspace created!')
                }
              }}
              className="flex items-center gap-1"
            >
              <FileText className="w-4 h-4" />
              New
            </Button>
            
            <div className="w-px h-6 bg-gray-300 mx-2" />
            
            <Button
              variant="outline"
              size="sm"
              onClick={runCode}
              className="flex items-center gap-1"
            >
              <Play className="w-4 h-4" />
              Generate
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const blob = new Blob([generatedCode], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `contract.${selectedLanguage === 'solidity' ? 'sol' : 'js'}`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
              }}
              className="flex items-center gap-1"
              disabled={!generatedCode}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            
            {selectedLanguage === 'solidity' && (
              <>
                <div className="w-px h-6 bg-gray-300 mx-2" />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={compileContract}
                  className="flex items-center gap-1"
                  disabled={!generatedCode || isCompiling}
                >
                  {isCompiling ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  {isCompiling ? 'Compiling...' : 'Compile'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deployContract}
                  className="flex items-center gap-1"
                  disabled={!generatedCode || !compileResult?.success || isDeploying || !isConnected}
                >
                  {isDeploying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  {isDeploying ? 'Deploying...' : !isConnected ? 'Connect Wallet' : 'Deploy'}
                </Button>
              </>
            )}
            
            <div className="flex-1" />
            
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+S</kbd> Save • 
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+O</kbd> Load • 
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+R</kbd> Generate • 
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+N</kbd> New
              {autoSave && (
                <span className="flex items-center gap-1 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Auto-save
                </span>
              )}
              {compileResult && (
                <span className={`flex items-center gap-1 ${compileResult.success ? 'text-green-600' : 'text-red-600'}`}>
                  {compileResult.success ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  Compile
                </span>
              )}
              {deployResult && (
                <span className={`flex items-center gap-1 ${deployResult.success ? 'text-green-600' : 'text-red-600'}`}>
                  {deployResult.success ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  Deploy
                </span>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div 
              ref={blocklyDiv} 
              className="w-full h-full"
              style={{ minWidth: '600px' }}
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="w-96 border-l bg-muted/50 flex flex-col">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">Generated Code</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Language: {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}
                  {selectedLanguage === 'solidity' && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      Smart Contract
                    </span>
                  )}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="h-8 w-8 p-0"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            
            {showSettings && selectedLanguage === 'solidity' && (
              <div className="mt-3 p-3 bg-white rounded border space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700">License</label>
                  <select
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    className="w-full mt-1 px-2 py-1 text-xs border rounded"
                  >
                    <option value="MIT">MIT</option>
                    <option value="GPL-3.0">GPL-3.0</option>
                    <option value="Apache-2.0">Apache-2.0</option>
                    <option value="Unlicense">Unlicense</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                
                {license === 'Custom' && (
                  <div>
                    <label className="text-xs font-medium text-gray-700">Custom License</label>
                    <input
                      type="text"
                      value={customLicense}
                      onChange={(e) => setCustomLicense(e.target.value)}
                      placeholder="Enter custom license"
                      className="w-full mt-1 px-2 py-1 text-xs border rounded"
                    />
                  </div>
                )}
                
                <div>
                  <label className="text-xs font-medium text-gray-700">Solidity Version</label>
                  <select
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full mt-1 px-2 py-1 text-xs border rounded"
                  >
                    <option value="^0.8.20">^0.8.20</option>
                    <option value="^0.8.19">^0.8.19</option>
                    <option value="^0.8.18">^0.8.18</option>
                    <option value="^0.8.17">^0.8.17</option>
                    <option value="^0.8.16">^0.8.16</option>
                    <option value="^0.8.15">^0.8.15</option>
                    <option value="^0.8.14">^0.8.14</option>
                    <option value="^0.8.13">^0.8.13</option>
                    <option value="^0.8.12">^0.8.12</option>
                    <option value="^0.8.11">^0.8.11</option>
                    <option value="^0.8.10">^0.8.10</option>
                    <option value="^0.8.9">^0.8.9</option>
                    <option value="^0.8.8">^0.8.8</option>
                    <option value="^0.8.7">^0.8.7</option>
                    <option value="^0.8.6">^0.8.6</option>
                    <option value="^0.8.5">^0.8.5</option>
                    <option value="^0.8.4">^0.8.4</option>
                    <option value="^0.8.3">^0.8.3</option>
                    <option value="^0.8.2">^0.8.2</option>
                    <option value="^0.8.1">^0.8.1</option>
                    <option value="^0.8.0">^0.8.0</option>
                    <option value="^0.7.6">^0.7.6</option>
                    <option value="^0.7.5">^0.7.5</option>
                    <option value="^0.7.4">^0.7.4</option>
                    <option value="^0.7.3">^0.7.3</option>
                    <option value="^0.7.2">^0.7.2</option>
                    <option value="^0.7.1">^0.7.1</option>
                    <option value="^0.7.0">^0.7.0</option>
                    <option value="^0.6.12">^0.6.12</option>
                    <option value="^0.6.11">^0.6.11</option>
                    <option value="^0.6.10">^0.6.10</option>
                    <option value="^0.6.9">^0.6.9</option>
                    <option value="^0.6.8">^0.6.8</option>
                    <option value="^0.6.7">^0.6.7</option>
                    <option value="^0.6.6">^0.6.6</option>
                    <option value="^0.6.5">^0.6.5</option>
                    <option value="^0.6.4">^0.6.4</option>
                    <option value="^0.6.3">^0.6.3</option>
                    <option value="^0.6.2">^0.6.2</option>
                    <option value="^0.6.1">^0.6.1</option>
                    <option value="^0.6.0">^0.6.0</option>
                    <option value="^0.5.17">^0.5.17</option>
                    <option value="^0.5.16">^0.5.16</option>
                    <option value="^0.5.15">^0.5.15</option>
                    <option value="^0.5.14">^0.5.14</option>
                    <option value="^0.5.13">^0.5.13</option>
                    <option value="^0.5.12">^0.5.12</option>
                    <option value="^0.5.11">^0.5.11</option>
                    <option value="^0.5.10">^0.5.10</option>
                    <option value="^0.5.9">^0.5.9</option>
                    <option value="^0.5.8">^0.5.8</option>
                    <option value="^0.5.7">^0.5.7</option>
                    <option value="^0.5.6">^0.5.6</option>
                    <option value="^0.5.5">^0.5.5</option>
                    <option value="^0.5.4">^0.5.4</option>
                    <option value="^0.5.3">^0.5.3</option>
                    <option value="^0.5.2">^0.5.2</option>
                    <option value="^0.5.1">^0.5.1</option>
                    <option value="^0.5.0">^0.5.0</option>
                    <option value="^0.4.26">^0.4.26</option>
                    <option value="^0.4.25">^0.4.25</option>
                    <option value="^0.4.24">^0.4.24</option>
                    <option value="^0.4.23">^0.4.23</option>
                    <option value="^0.4.22">^0.4.22</option>
                    <option value="^0.4.21">^0.4.21</option>
                    <option value="^0.4.20">^0.4.20</option>
                    <option value="^0.4.19">^0.4.19</option>
                    <option value="^0.4.18">^0.4.18</option>
                    <option value="^0.4.17">^0.4.17</option>
                    <option value="^0.4.16">^0.4.16</option>
                    <option value="^0.4.15">^0.4.15</option>
                    <option value="^0.4.14">^0.4.14</option>
                    <option value="^0.4.13">^0.4.13</option>
                    <option value="^0.4.12">^0.4.12</option>
                    <option value="^0.4.11">^0.4.11</option>
                    <option value="^0.4.10">^0.4.10</option>
                    <option value="^0.4.9">^0.4.9</option>
                    <option value="^0.4.8">^0.4.8</option>
                    <option value="^0.4.7">^0.4.7</option>
                    <option value="^0.4.6">^0.4.6</option>
                    <option value="^0.4.5">^0.4.5</option>
                    <option value="^0.4.4">^0.4.4</option>
                    <option value="^0.4.3">^0.4.3</option>
                    <option value="^0.4.2">^0.4.2</option>
                    <option value="^0.4.1">^0.4.1</option>
                    <option value="^0.4.0">^0.4.0</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-700">Deploy Network</label>
                  <select
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value)}
                    className="w-full mt-1 px-2 py-1 text-xs border rounded"
                  >
                    <option value="hardhat">Hardhat (Local)</option>
                    <option value="baseSepolia">Base Sepolia</option>
                    <option value="celoAlfajores">Celo Alfajores</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700">Auto-save</label>
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="rounded"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-auto">
            <div className="h-2/3 border-b overflow-auto">
              <SyntaxHighlighter 
                code={generatedCode} 
                language={selectedLanguage === 'solidity' ? 'solidity' : 'javascript'}
                className="text-xs p-3"
              />
            </div>
            <div 
              ref={outputDiv}
              className="p-3 text-sm h-1/3 overflow-auto"
            />
            {selectedLanguage === 'solidity' && (
              <div className="p-4 border-t bg-background/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Files</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Add .sol file
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = prompt('Enter .sol URL or npm-style path (e.g. @openzeppelin/contracts/token/ERC20/ERC20.sol):')
                        if (!url) return
                        const alias = prompt('Optional: import alias (e.g. ERC20)') || undefined
                        setImports(prev => [...prev, { path: url, alias }])
                      }}
                    >
                      Add from URL
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".sol"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const alias = prompt('Optional: import alias (e.g. MyLib)') || undefined
                        setImports(prev => [...prev, { path: `./${file.name}`, alias }])
                        e.currentTarget.value = ''
                      }}
                    />
                  </div>
                </div>
                <div className="rounded border bg-white overflow-hidden">
                  <div className="max-h-28 overflow-auto divide-y">
                    {imports.length === 0 ? (
                      <div className="p-3 text-xs text-muted-foreground">No imports added yet.</div>
                    ) : (
                      imports.map((imp, idx) => (
                        <div key={idx} className="p-3 text-xs flex items-center justify-between">
                          <div className="truncate">
                            {imp.alias ? (
                              <span className="mr-2 font-mono">import {imp.alias} from "{imp.path}";</span>
                            ) : (
                              <span className="font-mono">import "{imp.path}";</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setImports(prev => prev.filter((_, i) => i !== idx))}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
