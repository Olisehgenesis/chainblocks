import Layout from '@/components/Layout'
import { ReusableButton } from '@/components/ReusableButton'
import Link from 'next/link'

export default function DocsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ChainBlocks Documentation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to build smart contracts visually with ChainBlocks. 
              From basic data types to complex DeFi protocols.
            </p>
          </div>

          {/* Quick Start */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Quick Start</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Getting Started</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>Click "Enter App" to open the visual editor</li>
                  <li>Select Solidity from the language chooser</li>
                  <li>Drag blocks from the toolbox to build your contract</li>
                  <li>Add imports using the Files panel</li>
                  <li>Generate and copy your Solidity code</li>
                </ol>
              </div>
              <div className="text-center">
                <Link href="/app">
                  <ReusableButton className="px-6 py-3 text-lg">
                    Start Building
                  </ReusableButton>
                </Link>
              </div>
            </div>
          </div>

          {/* Block Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Data Types */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Data Types</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Fundamental building blocks for storing data in your smart contracts.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">uint</code> - Unsigned integers</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">address</code> - Ethereum addresses</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">bool</code> - Boolean values</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">string</code> - Text data</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">mapping</code> - Key-value storage</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">array</code> - Dynamic lists</li>
              </ul>
            </div>

            {/* Functions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Functions</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Define the behavior and logic of your smart contracts.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">public</code> - Accessible by anyone</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">private</code> - Internal only</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">view</code> - Read-only functions</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">pure</code> - No state access</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">payable</code> - Accepts ETH</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">modifier</code> - Reusable conditions</li>
              </ul>
            </div>

            {/* Contract Structure */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🏗️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Contract Structure</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Organize your code with contracts, inheritance, and interfaces.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">contract</code> - Main contract definition</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">constructor</code> - Initialization</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">inheritance</code> - Code reuse</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">interface</code> - Function signatures</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">struct</code> - Custom data types</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">enum</code> - Named constants</li>
              </ul>
            </div>

            {/* Events & Logging */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">📢</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Events & Logging</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Emit events for external applications to listen and react.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">event</code> - Define event structure</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">emit</code> - Trigger events</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">indexed</code> - Searchable parameters</li>
              </ul>
            </div>

            {/* Ether & Tokens */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Ether & Tokens</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Handle cryptocurrency transfers and token interactions.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">transfer</code> - Send ETH</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">send</code> - Low-level ETH transfer</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">call</code> - External calls</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">receive</code> - Accept ETH</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">ERC20</code> - Token standard</li>
              </ul>
            </div>

            {/* Error Handling */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Error Handling</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Validate conditions and handle errors gracefully.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">require</code> - Validate inputs</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">revert</code> - Cancel transaction</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">assert</code> - Internal checks</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">try-catch</code> - Error recovery</li>
              </ul>
            </div>
          </div>

          {/* Examples */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Example Contracts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Simple Storage</h3>
                <p className="text-gray-600 mb-3">
                  A basic contract that stores and retrieves a number value.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
                  <div>contract SimpleStorage {'{'}</div>
                  <div className="ml-4">uint256 public storedData;</div>
                  <div className="ml-4">function set(uint256 x) public {'{'}</div>
                  <div className="ml-8">storedData = x;</div>
                  <div className="ml-4">{'}'}</div>
                  <div>{'}'}</div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Token Transfer</h3>
                <p className="text-gray-600 mb-3">
                  Transfer tokens between addresses with balance checks.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
                  <div>function transfer(address to, uint256 amount) public {'{'}</div>
                  <div className="ml-4">require(balanceOf[msg.sender] {">="} amount);</div>
                  <div className="ml-4">balanceOf[msg.sender] -= amount;</div>
                  <div className="ml-4">balanceOf[to] += amount;</div>
                  <div>{'}'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ Best Practices</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Security</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Always validate inputs with <code className="bg-gray-100 px-2 py-1 rounded">require</code></li>
                  <li>• Use <code className="bg-gray-100 px-2 py-1 rounded">modifier</code> for access control</li>
                  <li>• Check for reentrancy attacks</li>
                  <li>• Test thoroughly before deployment</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Gas Optimization</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Use <code className="bg-gray-100 px-2 py-1 rounded">view</code> and <code className="bg-gray-100 px-2 py-1 rounded">pure</code> functions</li>
                  <li>• Pack structs efficiently</li>
                  <li>• Use events instead of storage for logs</li>
                  <li>• Minimize external calls</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔗 Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Official Docs</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• <a href="https://docs.soliditylang.org" className="text-blue-600 hover:underline">Solidity Documentation</a></li>
                  <li>• <a href="https://ethereum.org/developers" className="text-blue-600 hover:underline">Ethereum Developer Resources</a></li>
                  <li>• <a href="https://remix.ethereum.org" className="text-blue-600 hover:underline">Remix IDE</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Learning</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• <a href="https://cryptozombies.io" className="text-blue-600 hover:underline">CryptoZombies</a></li>
                  <li>• <a href="https://openzeppelin.com/learn" className="text-blue-600 hover:underline">OpenZeppelin Learn</a></li>
                  <li>• <a href="https://consensys.net/academy" className="text-blue-600 hover:underline">ConsenSys Academy</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Tools</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• <a href="https://hardhat.org" className="text-blue-600 hover:underline">Hardhat</a></li>
                  <li>• <a href="https://trufflesuite.com" className="text-blue-600 hover:underline">Truffle</a></li>
                  <li>• <a href="https://metamask.io" className="text-blue-600 hover:underline">MetaMask</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
