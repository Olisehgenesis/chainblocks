'use client'

import { useEffect, useRef, useState } from 'react'
import Layout from '@/components/Layout'
import * as Blockly from 'blockly'
import { javascriptGenerator } from 'blockly/javascript'
import { Button } from '@/components/ui/button'
import { registerSolidityBlocks } from '@/lib/solidity-blocks'
import { solidityGenerator } from '@/lib/solidity-generator'

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
  const [selectedLanguage, setSelectedLanguage] = useState('solidity')
  const [imports, setImports] = useState<{ path: string, alias?: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Load saved imports
  useEffect(() => {
    const saved = localStorage.getItem('solidity-imports')
    if (saved) {
      try { setImports(JSON.parse(saved)) } catch {}
    }
  }, [])

  // Persist imports
  useEffect(() => {
    localStorage.setItem('solidity-imports', JSON.stringify(imports))
  }, [imports])

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
              type: 'solidity_global_variable'
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
              type: 'controls_if'
            },
            {
              kind: 'block',
              type: 'controls_for'
            },
            {
              kind: 'block',
              type: 'controls_whileUntil'
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

    // Function to run code
    const runCode = () => {
      let code: string
      if (selectedLanguage === 'solidity') {
        // Pass imports to the generator
        solidityGenerator.setImports(imports)
        code = solidityGenerator.workspaceToCode(workspace)
      } else {
        code = javascriptGenerator.workspaceToCode(workspace)
      }
      
      if (codeDiv.current) {
        codeDiv.current.textContent = code
      }
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
          outputDiv.current.innerHTML = `<div class="text-green-600">Solidity code generated successfully!</div><div class="text-sm text-gray-600 mt-2">This code can be compiled and deployed to Ethereum.</div>`
        }
      }
    }

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
          <div className="p-4 border-b">
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
          <div className="flex-1 overflow-auto">
            <pre 
              ref={codeDiv}
              className="p-4 text-xs bg-muted font-mono overflow-auto h-1/2 border-b"
            />
            <div 
              ref={outputDiv}
              className="p-4 text-sm h-1/2 overflow-auto"
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
